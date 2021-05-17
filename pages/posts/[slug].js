import { getAllSlugs } from "../../lib/getAllSlugs";
import { getPostBySlug } from "../../lib/getPostBySlug";
import { getMDXComponent } from "mdx-bundler/client";
import React from "react";
import styled from "styled-components";
import Layout from "../../components/Layout";
import Head from "next/head";
import Intro from "../../components/Intro";
import { media } from "../../lib/theme";

const Content = styled.div`
  margin-left: 16px;
  margin-right: 16px;
  position: relative;

  ${media.lg} {
    max-width: 674px;
    margin-left: auto;
    margin-right: auto;
  }
`;

function Post({ code, frontmatter: { title } }) {
  const Component = React.useMemo(() => getMDXComponent(code), [code]);

  return (
    <Layout>
      <Head>
        <title>{title}</title>
      </Head>
      <Intro>{title}</Intro>
      <Content>
        <Component />
      </Content>
    </Layout>
  );
}

export default Post;

export async function getStaticProps({ params }) {
  const post = await getPostBySlug(params.slug);
  const { code, frontmatter } = post;

  return {
    props: {
      code,
      frontmatter: { ...frontmatter, date: frontmatter.date.toString() },
    },
  };
}

export async function getStaticPaths() {
  const slugs = getAllSlugs();

  return {
    paths: slugs.map((slug) => ({ params: { slug } })),
    fallback: false,
  };
}
