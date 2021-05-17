import Link from "next/link";
import styled from "styled-components";
import { media, typography } from "../lib/theme";
import { IntroWrapper, Title } from "./Intro";
import React from "react";

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.forestGreen};
  font-size: 1.5rem;
  margin-top: 5px;
`;

const Picture = styled.picture`
  top: 240px;
  left: 0;
  position: absolute;

  ${media.md} {
    top: 180px;
    bottom: -73px;
  }

  ${media.lg} {
    top: 60px;
    bottom: -73px;
  }
`;

const HomeIntro = () => {
  return (
    <IntroWrapper>
      <Title>Kia Ora! I'm Adrian.</Title>
      <Subtitle>Developer of sorts</Subtitle>
      <Picture>
        <source media="(min-width: 1280px)" srcSet="/jetplane-desktop.svg" />
        <source media="(min-width: 1024px)" srcSet="/jetplane-tablet.svg" />
        <img src="/jetplane-mobile.svg" />
      </Picture>
    </IntroWrapper>
  );
};

export default HomeIntro;
