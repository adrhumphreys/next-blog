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
