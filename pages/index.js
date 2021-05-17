import Head from "next/head";
import Image from "next/image";
import Layout from "../components/Layout";
import HomeIntro from "../components/HomeIntro";
import Posts from "../components/Posts";
import { getAllPosts } from "../lib/getAllPosts";

export default function Home({ posts }) {
  return (
    <Layout>
      <HomeIntro />
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
