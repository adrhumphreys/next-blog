---
date: 2018-11-25T02:46:59+00:00
description: "Neat visualisation of where buses and trains are"
tags: ["dev"]
title: "Auckland Transport Visualiser"
---
I wanted to try typescript with react and figured why not also find out why my bus was late

I decided I would use one of Auckland Transports (AT) APIs and try view where the buses where on a map, you can check it out at [at.jar.nz](https://at.jar.nz "🚌")

<iframe src="https://at.jar.nz" height="315" frameborder="0"></iframe>

**Where did I get the data?**

AT provide a handy API over here: [https://dev-portal.at.govt.nz](https://dev-portal.at.govt.nz "https://dev-portal.at.govt.nz"). Overall the experience with it was straightforward but I would have preferred if they just provided a GTFS photo file to use so I could get a more lightweight way of seeing the buses in real time. Another downside of the API was it would first return a server error and then the response almost every time you made a request.

To find out if it was a bus/train/tractor I needed to get the static GTFS file from AT and then export the route data I was interested in. I ended up getting the routes short/long name (e.g. "Rakino Island To Auckland", "RAK") but never got around to showing it to end users. I put this data in a JSON blob.

**Learnings**

_I sure do hope I learnt something from this mess_

Typescript was nice, it was practical and I could see the value in it for large projects but for small quicker pieces of work it was a bit verbose and I found that getting type definitions for the packages you were using was easy enough but there was the odd definition that was wrong (made a PR to correct it 🙏) for some of the packages I was using.

📦 Parcel.js was a blast and I'll be using it again for sure. It was stupid easy to use and I didn't feel limited using it. Would recommend you look at using [parcel-plugin-bundle-visualiser](https://github.com/gregtillbrook/parcel-plugin-bundle-visualiser#readme "parcel-plugin-bundle-visualiser") if your packages become large like mine did

Mapbox 🗺 make an awesome map library and Uber has done the hard yards of porting over the boilerplate for react with [react-map-gl](https://github.com/uber/react-map-gl "react-map-gl") which I enjoyed using _a lot more than_ Google maps

[Netlify](https://www.netlify.com "Netlify") is still my favourite for static hosting, this was deployed through there seamlessly