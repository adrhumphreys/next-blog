import Head from "next/head";
import styled from "styled-components";
import React from "react";
import { media } from "../lib/theme";
import Header from "./Header";
import Footer from "./Footer";

const Main = styled.main`
  ${media.lg} {
    padding-left: 40px;
    padding-right: 40px;
  }
`;

export const Layout = ({ children }) => {
  return (
    <>
      <Head>
        <title>Blog</title>
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          rel="preload"
          as="style"
          href="https://fonts.googleapis.com/css2?family=Noto&#43;Serif:ital,wght@0,700;1,700&amp;family=Oxygen:wght@400;700&amp;display=swap&display=swap"
        />

        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Noto&#43;Serif:ital,wght@0,700;1,700&amp;family=Oxygen:wght@400;700&amp;display=swap&display=swap"
          media="print"
          onLoad="this.media='all'"
        />

        <noscript>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Noto&#43;Serif:ital,wght@0,700;1,700&amp;family=Oxygen:wght@400;700&amp;display=swap&display=swap"
          />
        </noscript>
      </Head>
      <Header />
      <Main>{children}</Main>
      <Footer />
    </>
  );
};

export default Layout;
