import { bundleMDX } from "mdx-bundler";
import fs from "fs";
import { join } from "path";
import mdxOptions from "./mdxOptions";

export function getPageContents(location) {
  const realLocation = location.replace(/\.md$/, "");
  const pagesDir = join(process.cwd(), "_pages");
  const fullPath = join(pagesDir, `${realLocation}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  return bundleMDX(fileContents, mdxOptions);
}
