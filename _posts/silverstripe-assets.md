---
date: 2020-07-29
description: "A story of abstractions and issues only on a platform (not on local env)"
tags: ["dev"]
title: "Digging into a Silverstripe assets issue"
---

Let's start with the problem statement:
> When trying to publish a page in the CMS I am seeing a little alert with "error" in it and the page doesn't publish

First we need to track down the issue, we've got Raygun for error monitoring so we'll check there.
We can find an error message that looks like the following:
```sql
SilverStripe\ORM\Connect\DatabaseException: Couldn't run query:

UPDATE "SiteTree"
SET "HasBrokenFile" = ?, "HasBrokenLink" = ?, "NextReviewDate" = ?, "Content" = ?, "ExtraMeta" = ?, "PublishOnDate" = ?, "UnPublishOnDate" = ?, "LastEdited" = ?

WHERE ("ID" = ?)

HY000-1205: Lock wait timeout exceeded; try restarting transaction
```

## First assumption:  
This is an issue with the database  
- We can check monitoring in Grafana for our RDS and confirm that it's not under any heavy load
- We can run `SHOW FULL PROCESSLIST;` and check for any processes that have gotten into an odd stuck state (there is a process holding a database connection open, but not using it - This is often consistent with PHP that is taking a long time to process the data.)
- We can check for previous deadlocks via `SHOW ENGINE INNODB STATUS;` but that doesn't enlighten us with any meaningful information

We can rule out this being an issue with other connections to the database at this point. We'll start taking a database snapshot to try and replicate the issue locally (this process will take around 2-3 hours due the size of the database).


## Second assumption:
It's specific to the content of the page being published.  
We can publish other pages on the site so it looks like it might be a combination of content thats on the page and what gets executed when we publish it.

We'll recreate the page in both our Staging environment and in our Production environment and check if publishing still breaks the page. First to complete is the Staging page and it publishes without issues. The production page is then completed and it breaks.

Alright we're onto something, this issue is only seen on production and only with this specific content. We'll start to do a basic process of elimination to find the content that's causing the issue.

First we remove the carousel thats at the top of the page and try to publish it, this publishes the page without issue. We recreate the carousel and use a different linked asset, it publishes as expected. We use the previous asset and it doesn't publish.

Alright we've identified that it's a particular asset, in this case it's Video (an Image with extra meta data linking to a YouTube video). We now try to publish the asset by itself and get a new error, `503 Service Unavailable`.

We can see that this error is caused by our CDN responding with a generic error when our server times out. 

We recreate the asset on our staging server and it breaks, alright we're onto something. We can confirm that the request is also see that we're getting a `504 Gateway Timeout` from nginx since we can bypass the CDN on our staging server. nginx is configured to timeout after 4 minutes by default.

## Third assumption:
The asset thumbnail or processing of it is causing our error.  
We try to recreate the asset issue again but it doesn't break, it uploads just fine. We try a few more times and the assets are behaving like normal. We go back to production and try reproducing it again and the new assets behave fine. The assets that were broken, stay broken however.

*At this point we've gone back to the client with assets that work for the page in question so their marketing team can launch the campaign while we investigate the issue further.*

## Fourth assumption:
The Elastic File System (EFS) is not keeping in sync correctly creating broken files.  
It's a long shot but when we first save a Video we grab the image from YouTubes oembed API, and download the linked thumbnail to serve as the default asset. We can see the process outlined in our method `onBeforeWrite` which is also called when you publish something.

Lets look at some code from this function:
```php
<?php
$valid = true;

if (strlen($this->VideoCode) === 0) {
	$valid = false;
}

if (strlen($this->VideoType) === 0) {
    $valid = false;
}


if ($valid && $this->isInDB() && !$this->isChanged('VideoURL', DataObject::CHANGE_VALUE)) {
	return;
}
```

We know that the `VideoCode` and `VideoType` already exist based on the database backup. Therefore `valid` will be `true`, we know the record already exists so `isInDB` will be true and we haven't changed the VideoURL so `!isChanged` will be true too.

Therefore we can eliminate the YouTube generator firing again on publish as a likely culprit of this issue.

One other source for the file sync, could the EFS connection gone sideways and the asset on the server themselves is different. We can SSH in and check the hashes and permissions for the files and confirm their the same.

## Reproducible locally?
We've restored the database to our local environment, but can't find a way to reproduce it locally

## More information is needed.
We'll create a small snippet of code to make reproducing the issue easier. The task looks like the following:
```php
<?php
$video = Video::get_by_id((int) $id);
$video->publishRecursive();
```

We can run these from the command line while SSH'ed into our staging server. The task runs for >30 minutes and then we get the following exception:
```js
Fatal error: Allowed memory size of 1073741824 bytes exhausted (tried to allocate 20480 bytes) in /var/www/mysite/releases/046d2d2565825741941ddfa598701a937f48dafd/vendor/league/flysystem/src/Adapter/Local.php on line 508
Fatal error: Allowed memory size of 1073741824 bytes exhausted (tried to allocate 32768 bytes) in /var/www/mysite/releases/046d2d2565825741941ddfa598701a937f48dafd/vendor/graze/monolog-extensions/src/Graze/Monolog/Formatter/RaygunFormatter.php on line 1
```
Alright the first exception is from us running out of memory which is fine and standard, the second is when PHP has reset the memory, etc to push out the exception and run out of memory trying to do that. This means our call stack/info was too large for PHP to even send away. This sounds like it might be something recursive, PHP by default doesn't have call stack limitations, that's added by XDebug which isn't on these servers

## Fifth assumption:
It's the file staying open in the file system on one of the servers while the other tried to publish it.  
We cycle all our instances out to get a fresh slate. The issue still occurs so we can rule that out.

## Sixth assumption:
We've updated the packages responsible for PHP, Apache, Nginx, etc and that's introduced this issue.  
We rollback to a previous version, it doesn't fix the issue though.

## Profile the task with [Blackfire](https://blackfire.io/):
If we profile it, we can identify what's going astray.
First we start by profiling the task on a known *good* asset, it profiles as expected and is very short. We then try it on the broken asset, the task runs for too long, our machine is automatically identified as being in a broken state by running out of memory, or processing power, etc. It gets cycled out and we can't get a profile.

## Lets log things!
We can't debug anything as it's only on our staging server. We can't profile anything as it breaks the instance. Let's do some cheap logs throughout the code to find the cause.

First we start with the `onBeforeWrite` we'll edit the Extensible class from the framework to log the extensions applied to the class and the methods being called. We can see that it gets through *most* of the `onBeforeWrite` calls but hangs at the Files `onBeforeWrite`. Alright lets dig into that method.

We litter some logs throughout the method and identify it hanging at the stage of calling `AssetControlExtension::deleteAll`. Alright so what is happening here, why when we publish an asset are we deleting files?
When we publish an asset first we need to delete all the variations of that asset that could exist. The frameworks assets code doesn't create a strong link between the asset and it's variations (e.g. a cropped 500x500 version of the asset) apart from the filename of that asset containing a partial hash of the original asset. So when we publish an asset the framework deletes the existing variants to prevent them hanging around

Now we enter various layers of abstraction on the file system as both the frameworks asset system and the underlying third party framework `league\flysystem` try to support using different systems such as your local file system or S3.

Here's the code we're concerned with in the `deleteAll` method:
```php
<?php
$store = $this->getAssetStore();
foreach ($assets as $asset) {
	$store->delete($asset['Filename'], $asset['Hash']);
}
```

We can find that the `AssetStore` we're using is `FlysystemAssetStore` and we can look at the delete method on it which looks like the following:
```php
<?php
public function delete($filename, $hash)
{
    $response = false;

    $this->applyToFileOnFilesystem(
        function (ParsedFileID $pfid, Filesystem $fs, FileResolutionStrategy $strategy) use (&$response) {
            $response = $this->deleteFromFileStore($pfid, $fs, $strategy) || $response;
            return false;
        },
        new ParsedFileID($filename, $hash)
    );

    return $response;
}
```

Alright so we know this is going to call `deleteFromFileStore` to delete the file. We can look at that method which looks like the following:
```php
<?php
protected function deleteFromFileStore(ParsedFileID $parsedFileID, Filesystem $fs, FileResolutionStrategy $strategy)
{
    /** @var FileHashingService $hasher */
    $hasher = Injector::inst()->get(FileHashingService::class);

    $deleted = false;
    /** @var ParsedFileID $parsedFileIDToDel */
    foreach ($strategy->findVariants($parsedFileID, $fs) as $parsedFileIDToDel) {
        $fs->delete($parsedFileIDToDel->getFileID());
        $deleted = true;
        $hasher->invalidate($parsedFileIDToDel->getFileID(), $fs);
    }

    // Truncate empty dirs
    $this->truncateDirectory(dirname($parsedFileID->getFileID()), $fs);

    return $deleted;
}
```

With our logs we can identify we never actually get to the ` $fs->delete` part of the code it hangs on `$strategy->findVariants`. The strategy being used is `FileIDHelperResolutionStrategy`, lets look into this.

When looking at `FileIDHelperResolutionStrategy::findVariants` we can see it first looks for all `FileIDHelper`'s it can find and checks if they apply here. It will then use those helpers to identify the variants of the asset and add those variants to an array.

There's one line that stands out here, there's a line with the following code:
```php
<?php
$possibleVariants = $filesystem->listContents($folder, true);
```
That second argument is to recursively list the contents, the folder is our root assets directory. We can jump into that code, which is the `Local` adapter for flysystem. The code looks like the following:
```php
<?php
public function listContents($directory = '', $recursive = false)
{
    $result = [];
    $location = $this->applyPathPrefix($directory);

    if ( ! is_dir($location)) {
        return [];
    }

    $iterator = $recursive ? $this->getRecursiveDirectoryIterator($location) : $this->getDirectoryIterator($location);

    foreach ($iterator as $file) {
        $path = $this->getFilePath($file);

        if (preg_match('#(^|/|\\\\)\.{1,2}$#', $path)) {
            continue;
        }

        $result[] = $this->normalizeFileInfo($file);
    }

    unset($iterator);

    return array_filter($result);
}
```

So we're recursively looping through every directory and file and getting the meta data for each of them. We're adding that all to an array in the process. This is why our exception was thrown when running out of memory and it was only adding a small fraction to the available memory.

With this new knowledge we now can try to reproduce the issue by creating an asset in the root directory of assets. We create the new file it gets saved to `assets/[hash]/file.jpg`. We click publish and it's fine, we then replace the file and it again gets uploaded to `assets/[hash2]/file2.jpg` but when we publish it, it breaks. As expected the code is on this replacement now trying to delete the existing asset and to do so is trying to recursively loop through all the assets that exist in `assets`. In our case the we have >800gb of assets, more than 130,000 recorded assets in the database and each of those have 10's of variations.

## Conclusion

We've identified the issue, and raised it [here](https://github.com/silverstripe/silverstripe-assets/issues/414). We can report back to the client that we know what's happening and are working directly with the product team to resolve the issue (still in progress at time of writing).  

We can also provide a simple work around, place your files in a new folder rather than in the root directory (as it will only recursively search for the file from where it's located).