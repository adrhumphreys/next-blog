import React from "react";
import styled from "styled-components";
import Layout from "../components/Layout";
import { getMDXComponent } from "mdx-bundler/client";
import { getPageContents } from "../lib/getMarkdownPage";
import HomeIntro from "../components/HomeIntro";

const PageHolder = styled.div`
  margin-top: 80px;
  margin-left: auto;
  margin-right: auto;
  max-width: 706px;
  padding-left: 16px;
  padding-right: 16px;
`;

export default function Projects({ code }) {
  const Component = React.useMemo(() => getMDXComponent(code), [code]);
  return (
    <Layout>
      <HomeIntro title="Contact me." subtitle="I prefer mail" />
      <PageHolder>
        <Component />
      </PageHolder>
    </Layout>
  );
}

export async function getStaticProps() {
  let { code } = await getPageContents("contact");

  return {
    props: {
      code,
    },
  };
}
