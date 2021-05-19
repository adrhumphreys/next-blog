import React from "react";
import Layout from "../components/Layout";
import HomeIntro from "../components/HomeIntro";
import Posts from "../components/Posts";
import { getAllPosts } from "../lib/getAllPosts";

export default function Home({ posts }) {
  return (
    <Layout>
      <HomeIntro title="Test deploy previews." subtitle="Developer of sorts" />
      <Posts posts={posts} />
    </Layout>
  );
}

export async function getStaticProps() {
  let posts = await getAllPosts();

  return {
    props: {
      posts,
    },
  };
}
