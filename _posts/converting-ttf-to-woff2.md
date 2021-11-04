---
date: 2021-11-05
description: "Self hosted Google fonts"
tags: ["dev"]
title: "Converting TTF to Woff2"
---

You've gone to Google fonts and downloaded a zip of `ttf` files and you call it a day. You can host them and use them and everyone's happy.

But the files are large, and we're making users download them all, this is awkward...

In comes `woff2` which is some sick compression algo applied to fonts. We're web developers, we don't write for loops we use them.

We'll use Googles library: https://github.com/google/woff2

## Steps
1. Clone it `git clone --recursive https://github.com/google/woff2.git`
2. Go into the repo `cd woff2`
3. Make it `make all`
4. Run it `./woff2_compress Roboto-Bold.ttf`
5. Enjoy
