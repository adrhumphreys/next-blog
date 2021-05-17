---
date: 2020-07-30
description: "Lets purge some URLs"
tags: ["dev"]
title: "Purging a bulk list of URLs in Akamai"
---

So you have a list of URLs you want to purge. You could use the web interface but it's limited to just 500 at a time and you don't want to manually process it all.

By the end of this you'll be able to purge a list of URLs like below:
```html
https://example.com
https://example.com/a
https://example.com/b
```

First you're going to need to create API credentials with CCU access. You can then create a `.edgerc` file for those credentials (Akamais client requires it be passed through as file)
```html
[default]
host = put
client_token = your
client_secret = settings
access_token = here
```

We can then move onto creating our go application:
```go
package main

import (
    "bufio"
    "fmt"
    "github.com/akamai/AkamaiOPEN-edgegrid-golang/ccu-v3"
    "github.com/akamai/AkamaiOPEN-edgegrid-golang/edgegrid"
    "log"
    "net/url"
    "os"
)

func main(){
    // This is your list of urls formatted like mentioned above
    file, err := os.Open("./urls.txt")
    if err != nil {
        log.Fatal(err)
    }
    defer file.Close()
    scanner := bufio.NewScanner(file)
    var urls []string
    for scanner.Scan() {
        baseUrl, err := url.Parse(scanner.Text())
        if err != nil {
            // We double check your URLs aren't malformed
            fmt.Println("Malformed URL: ", err.Error())
            return
        }
        urls = append(urls, baseUrl.String())

        // We purge the URLs in bundles of 300 due to the limit
        // on the API being set to a certain amount of characters.
        // Adjust this as needed
        if len(urls) >= 300 {
            purgeURLs(urls)
            urls = nil
        }
    }

    // Purge the remaining files from the end of the loop
    purgeURLs(urls)
    urls = nil

    if err := scanner.Err(); err != nil {
        log.Fatal(err)
    }
}

func purgeURLs(urls []string)  {
    purgeByType := "url"
    // Test this out on your staging network first if you're
    // risk adverse.
    network := "production"
    config, _ := edgegrid.Init("./.edgerc", "default")
    ccu.Init(config)
    purge := ccu.NewPurge(urls)
    // You can change this to delete if needed
    res, err := purge.Invalidate((ccu.PurgeTypeValue)(purgeByType), (ccu.NetworkValue)(network))
    if err != nil {
        fmt.Println(urls)
        log.Fatal(err)
    }
    fmt.Println(res.HTTPStatus)
}
```

Now run the task, sit down and have a cuppa as it purges all your URLs ☕️