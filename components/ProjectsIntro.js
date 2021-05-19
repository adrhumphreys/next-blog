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
  pointer-events: none;
  top: 190px;
  left: 0;
  position: absolute;

  ${media.lg} {
    top: 110px;
    left: -10px;
  }

  ${media.xl} {
    top: 0;
    left: 0;
  }
`;

const ProjectsIntro = () => {
  return (
    <IntroWrapper>
      <Title>Projects.</Title>
      <Subtitle>Personal projects I've been working on</Subtitle>
      <Picture>
        <source
          media="(min-width: 1280px)"
          srcSet="/jetplane-desktop-red.svg"
        />
        <source media="(min-width: 1024px)" srcSet="/jetplane-tablet-red.svg" />
        <img src="/jetplane-mobile-red.svg" />
      </Picture>
    </IntroWrapper>
  );
};

export default ProjectsIntro;
