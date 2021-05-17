import { createGlobalStyle, ThemeProvider } from "styled-components";
import React from "react";
import { media, typography } from "../lib/theme";
import prismTheme from "../lib/prismTheme";

const theme = {
  colors: {
    darkGrey: "#303C38",
    forestGreen: "#2E8364",
    primary: "#0070f3",
    peachyLight: "#FDF6F5",
  },
};

const GlobalStyle = createGlobalStyle`
  body {
    font-size: 1rem;
    color: ${theme.colors.darkGrey};
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: ${typography.oxygen};
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    font-smooth: always;
  }
  
  a {
    color: ${theme.colors.forestGreen};
    border-bottom: 2px solid transparent;
    text-decoration-color: transparent;
    text-underline-offset: 3px;
    text-underline-style: words;
    transition: text-decoration-color 150ms; 
    
    &:hover {
      text-decoration-color: ${theme.colors.forestGreen};
    }
  }
  
  li code,
  p code {
	background-color: ${theme.colors.peachyLight};
	font-family: monospace;
	padding: 2px 5px;
  }
  
  pre {
    ${media.lg} {
      position: relative;
      width: 840px;
      left: -83px;
    }
  }
  
  iframe,
  img {
    width: 100%;
  }
  
  ${prismTheme}
`;

function MyApp({ Component, pageProps }) {
  return (
    <>
      <GlobalStyle />
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
}

export default MyApp;
