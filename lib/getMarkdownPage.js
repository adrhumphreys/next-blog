import fs from "fs";
import { join } from "path";
import callBundleMDX from "./callBundleMDX";

export function getPageContents(location) {
  const realLocation = location.replace(/\.md$/, "");
  const pagesDir = join(process.cwd(), "_pages");
  const fullPath = join(pagesDir, `${realLocation}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  return callBundleMDX(fileContents);
}
