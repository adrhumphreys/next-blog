---
title: "Migrating between tag managers"
date: 2020-06-29T08:54:59+12:00
description: "How we migrated from the Adobe DTM tag manager to Adobe Launch tag manager using Akamai"
tags: ["dev"]
---

This is a guide for how to effectively migrate from one tag manager to another when you have a large amount of statically cached pages which you can't easily regenerate or flush the entire CDN cache for.

First the setup for our specific instance:
We have a website that is being hosted via AWS and the pages for it are all static html files that get generated on user actions and a general rolling recache. For this site we have over 800,000 cache entries so our current regeneration period lands at around 12 days. Recaches are heavy on both the server itself (image generation) and the database (large pages built with blocks) so scaling up the server is expensive at this point (the next DB tier is >$4000).

Now for our tag manager setup, we've been using Adobe's DTM for many years now and it's been sunset. So we need to migrate across to another manager. For our use-case Adobe Launch fits in perfectly with our existing setup, allowing a tight integration into Adobe Analytics.

At the beginning of this project we have a script in the head for every page like so:
```html
<script type="text/javascript" src="//assets.adobedtm.com/satelliteLib.js"></script>
```

We were using Adobe to host (requiring us to pay the 3rd party price for connecting) and we were also loading it non-async (this meant the sites speed was relative to how fast you could get this file).

## Migrate to a non specific link
The first stage was to migrate away from hosting the library via Adobe and load in the script ourselves. We effectively wanted to have the tag manger script looking like the following:
```html
<script type="text/javascript" src="/tag-manager.js" async></script>
```

We would then be able to switch the file out with Launches and not need to recache each page.

Setup for this was relatively easy, you can use [Akamai's Netstorage](https://learn.akamai.com/en-us/webhelp/netstorage/netstorage-user-guide/GUID-E6CE2D96-969E-4AD1-B509-6C34A43AD9A9.html) and setup a FTP user account that has access to a specific folder. From there you can plug in your FTP details into DTM and publish the library. From then onwards you'll have the DTM library uploaded to your netstorage account each time it's published.

From there you can start configuring your property in Akamai
You'll want to add a new blank rule and then configure the criteria to match the specific paths, I suggest going with something specific like `/adobedtm/*`.
From there you'll need to set behaviours: The Origin Server needs to have its type set to NetStorage and the NetStorage account you're using to host the DTM library. You'll also want to remove the `X-Frame-Options` header from this request so you can use this URL on your testing/local environments

You'll now want to set up the rule for your `/tag-manager.js` script. This is simply a match for the path and then the behaviour to modify the outgoing request path to replace the entire path to your DTM script location in NetStorage e.g. `/adobedtm/satelliteLib.js`

You can now update the script to point to `/tag-manager.js` and go through your QA process to ensure it's working as expected

## Set up Launch on Akamai through SFTP
To get this started you'll want to add SSH permissions to your upload user for Akamai NetStorage. First things first we need to generate a new SSH key to be used. I've copied this from [Configuring an SFTP server for use with Adobe Launch](https://medium.com/launch-by-adobe/configuring-an-sftp-server-for-use-with-adobe-launch-bc626027e5a6) which is a helpful article on setting up SFTP with Launch.
`ssh-keygen -m PEM -t rsa -b 4096 -C "your-email+testing-sftp-launch@example.com" -N '' -f ~/.ssh/id_rsa_launch_sftp_testing`

You can now run `cat ~/.ssh/id_rsa_launch_sftp_testing.pub` and copy the output into your uplaod accounts SSH key.

To test your key out you can run SFTP like so: `sftp -oIdentityFile=~/.ssh/id_rsa_launch_sftp_testing -oHostKeyAlgorithms=+ssh-dss -vv sshacs@example.com`
You'll want to replace the example domain with the one in your NetStorage config.

You can now follow along with the guide linked before to set up the host in Akamai.

## Switch over
Now we can update the Akamai property to also expose our `/adobelaunch` files. We can then change the rule for the path `/tag-manager.js` to now point to the launch files and apply the property. This should now let you roll over rather quickly without needing to quickly recache all the content or make too many changes

## Gotchas
If you change between connecting to Akamai via staging/prod then you need to unload your keys from your ssh agent, which can be done by running `ssh-add -D`. Otherwise sftp will have added it to the list of keys, use that one as the first key and then Akamai will see you connecting to a server with that key and presume you got your servers mixed up (odd issue, but ok).
Launch SFTP requires you're key to be a specific type, follow the article linked for generating they key