import fs from "fs";
import { postsDirectory } from "./postsDirectory";

export function getAllSlugs() {
  const posts = fs.readdirSync(postsDirectory);
  return posts.map((fileName) => fileName.replace(/\.md$/, ""));
}
