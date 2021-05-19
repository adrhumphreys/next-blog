import path from "path";
import mdxOptions from "./mdxOptions";
import { bundleMDX } from "mdx-bundler";

export default function callBundleMDX(fileContents) {
  if (process.platform === "win32") {
    process.env.ESBUILD_BINARY_PATH = path.join(
      process.cwd(),
      "node_modules",
      "esbuild",
      "esbuild.exe"
    );
  } else {
    process.env.ESBUILD_BINARY_PATH = path.join(
      process.cwd(),
      "node_modules",
      "esbuild",
      "bin",
      "esbuild"
    );
  }

  return bundleMDX(fileContents, mdxOptions);
}
