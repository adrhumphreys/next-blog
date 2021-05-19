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
