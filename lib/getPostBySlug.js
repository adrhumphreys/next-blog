import { bundleMDX } from "mdx-bundler";
import fs from "fs";
import { join } from "path";
import { postsDirectory } from "./postsDirectory";
import mdxOptions from "./mdxOptions";

export function getPostBySlug(slug) {
  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = join(postsDirectory, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  return bundleMDX(fileContents, mdxOptions);
}
