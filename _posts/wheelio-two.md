---
date: 2021-06-25T12:58:08-04:00
description: "They can change their code but can they change how cheap I am?"
tags: ["dev"]
title: "Take two, Wheelio boogaloo"
---

Previously I wrote about getting the coupons from Wheelio through code over [here](/wheelio). Now they've updated their code, it's no longer a simple hey lets look at the window object. Lets dig in.

### Looking at the code
There's a call in our network requests to the following url:
`https://dashboard.wheelio-app.com/api/wheelioapp/getsettings?jsonp=WheelioAppJSONPCallback410&shopId=shopename.myshopify.com&domain=x&currentUrl=hx%2F&uid=410`

It returns some unreadable contents that looks like:
```
window['WheelioAppJSONPCallback410']('U2Fsd...')
```
So we know that we're calling the function `WheelioAppJSONPCallback410` and passing the string into it. If we then look up the function, we get the following: `(_0x27a9e3){_0x1fb94f(_0x27a9e3);}`

Cool so there's some form of obfuscation applied to the js code. If we then grab the string from the response and huck it into [cyber chef](https://gchq.github.io/CyberChef/) going from base64 we get one word at the front: `Salted__.Xã.í&y.E`. So we know this is some encoded text, lets jump into the js land and see if there's anything obvious.

Aight so we have the main file located at: `https://wheelioapp.azureedge.net/app/index.min.js`. If we look in that file we can see a reference to [crypto-js](https://github.com/brix/crypto-js/) and it their importing the `aes` file directly from the library.

Let's create a basic version of what their probably doing:
```javascript
import CryptoJS from 'crypto-js'

const key = 'my sick key'
const encrypted = CryptoJS.AES.encrypt(JSON.stringify({a: 'b'}), key);
const result = CryptoJS.AES.decrypt(encrypted, key);
const originalText = result.toString(CryptoJS.enc.Utf8);
const decoded = JSON.parse(originalText)
```

If we grab the value of `encrypted` as a string by calling `encrypted.toString()` we get `U2FsdGVkX19/UH7E7enooF2LUmLfPAxrYe42fwXef20=`. Hey it's the same starting characters as the Wheelio response, we're onto something. So know all we need is the key they used to decrypt responses.

We know the function is going to be called `decrypt` so we can search for that and we get a line that looks like the following:
```
let _0x4de99e = CryptoJS[_0x5dad('0x25')]['decrypt'](_0x5a4f56, _0x1b09d6)[_0x5dad('0x7f')](CryptoJS[_0x5dad('0x4')][_0x5dad('0x36')]);
```

We know the second argument is the key, so we now know it's stored in `_0x1b09d6`, a quick search for that, and we find `_0x1b09d6 = Shopify['shop']`. `Shopify['shop']` is a value stored on the window, so we can then just grab the value and use it as our key.

We can now decrypt the message and confirm that inside the object there is an `App` property and inside that there is a `Coupons` property which holds all the coupons. _Fun._ 