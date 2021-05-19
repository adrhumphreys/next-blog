---
date: 2021-05-19
title: "Moving from Hugo to Next.js"
description: "I wonder if I could just blog about making a blog..."
tags: ["dev"]
---

You're looking at the new blog right now, the old one written in hugo is located [here](https://hugo.jar.nz). The first difference you'll notice is I accidentally reduced the font size of the intro blocks. _Yeah I'm good_.

## Getting content from markdown
We're using [mdx-bundler](https://github.com/kentcdodds/mdx-bundler) because it's fast, and uses the 🦤 emoji.

### How do we fetch a post?
Nice question, so we have simple function for it, you pass it a slug and then and you get the code you can pass to `getMDXComponent` and the frontmatter:
```js
import fs from "fs";
import { join } from "path";
import { postsDirectory } from "./postsDirectory";
import callBundleMDX from "./callBundleMDX";

export function getPostBySlug(slug) {
  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = join(postsDirectory, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  return callBundleMDX(fileContents);
}
``` 

You'll notice we have our own `callBundleMDX`. This is because I was calling `bundleMDX` in multiple places and needed to patch in a known [issue with next.js and esbuild](https://github.com/kentcdodds/mdx-bundler#nextjs-esbuild-enoent)

To enable the code highlighting that you're seeing here I'm using a mapbox's [rehype prism plugin](https://github.com/mapbox/rehype-prism), we add in the plugin as a mdxOption like so:

```js
const reHypePrism = require("@mapbox/rehype-prism");

const mdxOptions = {
  xdmOptions(options) {
    options.rehypePlugins = [...(options.rehypePlugins ?? []), reHypePrism];
    return options;
  },
};

export default mdxOptions;
```

The trickiest part for me was figuring out how to get a list of all posts. I found that the frontmatter would parse dates and create new dates which are not JSON serializable. I handled this by using [date-fns](https://date-fns.org) to format the dates as I would intent to show them.

The next annoyance was that `bundleMDX` would return a promise, so we'd end up with an array of promises. Next won't allow promises to be passed through, and I suck at understanding anything aside from the most basic of code, so I ended up return one Promise to rule them all which I could then `await`. Below is the code if by some small chance it helps any other poor soul.

```js
import fs from "fs";
import { format, compareDesc } from "date-fns";
import { postsDirectory } from "./postsDirectory";
import { getPostBySlug } from "./getPostBySlug";

export async function getAllPosts() {
  const slugs = fs.readdirSync(postsDirectory);
  const posts = slugs.map((slug) =>
    getPostBySlug(slug).then(({ frontmatter }) => ({
      slug: slug.replace(/\.md$/, ""),
      ...frontmatter,
    }))
  );
  return Promise.all(posts).then((posts) =>
    posts
      .sort((post1, post2) => compareDesc(post1.date, post2.date))
      .map((data) => ({
        ...data,
        // We can't pass dates through as props so we need to format it here
        // or encode it then decode it on the client which seems worse
        date: format(data.date, "EEEE, d MMMM, yyyy"),
      }))
  );
}
```

## Styles
I'm using [styled components 💅🏾](https://styled-components.com), I found these to be great. I imagine after that on a larger project I would end up with 100 different named styles that would all extend one another. I think [styled system](https://styled-system.com) would be super neat if I were looking at creating a UI component library.

I'm still trying to figure out a nice way to approach media queries, I've currently settled on variables like so:
```js
export const media = {
  md: "@media (min-width: 768px)",
  lg: "@media (min-width: 1024px)",
  xl: "@media (min-width: 1280px)",
};
```

We can then use the media variables in our styled definitions:
```js
const FunkyText = styled.p`
  color: red;

  ${media.lg} {
    color: yellow;
  }
`;
```

## Fin.
Would I do it again? I enjoy working with Next and would love to try developing a more sizable application in it. _Watch this space_