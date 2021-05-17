---
date: 2020-06-27T12:58:08-04:00
description: "A dive into the distance I will go to save a few dollars"
tags: ["dev"]
title: "Cheating wheel of fortunes (Wheelio)"
---

Recently I was trying to nab a copy of [Spirit Island](https://boardgamegeek.com/boardgame/162886/spirit-island) on the cheap. I'd found a site offering it for a good price and was intending on purchasing it when I noticed they were using a wheel of fortune.
I found that you could spin it as much as you wanted but you'd always get the same result, my first thought was how can I cheat this? I did a quick search and came across [this article](https://medium.com/mitchtalmadge/how-companies-like-hush-blankets-are-taking-advantage-of-your-emotions-for-profit-469b45a4156c) from 2018. It gave me hope and I went to inspect the network requests.

![Websockets requests with Wheelio](/wheelio/websockets.png)
We're in luck, their still using websockets to communicate and send the emails. After digging into the messages sadly they weren't sending the coupons back any more.

We can check all network requests and find that the coupon isn't retrieved at all. This means it's somewhere in the code. Running a quick find in the dev tools to search for our specific coupon comes up short, it must be "encrypted" somehow to prevent these kinds of basic checks.

It's time to read some code. We have two files that are sent down, one that looks to be the Wheelio script for all users and another that's specific to the site (it includes a query param of `shop`). We'll start with this specific script as it's our likely candidate. We'll grab the code and run it through prettier to make reading it easier. First things, first, let's search for "coupon" and see where that gets us.

```js {linenos=table,linenostart=764}
(window[$fog$140] = {
  config: {
    apiKey: $fog$141,
    authDomain: $fog$142,
    databaseURL: $fog$143,
    storageBucket: $fog$144,
  },
  loaded: !$fog$10,
  shopmeta: {
    coupons: [],
    loosingSlices: [],
    urls: [],
    emailSegments: [],
    customFields: [],
  },
  _dataLoadingStage: $fog$0,
  _stats: {},
  _statsLoaded: !$fog$10,
  _shopRoot: $fog$53,
  isDeviceAllowed: !$fog$10,
```

Just like that we now know that attached to the window there is likely an object which has `shopmeta.coupons`. Being the lazy reader I am I'll just view the window object in dev tools and try to find it.
![Coupon object](/wheelio/coupons.png)
Well that was easy, we can see that you can access it easily via `window.wloCore.shopmeta.coupons`. We can also see that this store has made only the 5% off discount available. The trick here is they should've also disabled the other coupons if they didn't want them used.

And there you have it, when you next see one of those annoying wheels, grab yourself a bargin 🌝  
*(PS you can find shops using it via their [reviews](https://apps.shopify.com/wheelio-first-interactive-exit-intent-pop-up#reviews))*