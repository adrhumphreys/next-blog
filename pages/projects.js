import React from "react";
import styled from "styled-components";
import Layout from "../components/Layout";
import ProjectsIntro from "../components/ProjectsIntro";
import { getMDXComponent } from "mdx-bundler/client";
import { getPageContents } from "../lib/getMarkdownPage";

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
      <ProjectsIntro />
      <PageHolder>
        <Component />
      </PageHolder>
    </Layout>
  );
}

export async function getStaticProps() {
  let { code } = await getPageContents("projects");

  return {
    props: {
      code,
    },
  };
}
