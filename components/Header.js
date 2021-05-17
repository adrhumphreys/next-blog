import styled from "styled-components";
import Link from "next/link";
import { media } from "../lib/theme";
import React from "react";

const HeaderWrapper = styled.header`
  display: flex;
  justify-content: space-between;
  padding: 20px 16px;
  position: relative;
  z-index: 1;

  ${media.lg} {
    margin-left: 40px;
    margin-right: 40px;
  }
`;

const LinkContainer = styled.p`
  margin-top: 0;
  margin-bottom: 0;

  &:first-of-type a {
    text-decoration-color: ${({ theme }) => theme.colors.forestGreen};
  }

  &:last-of-type a {
    margin-left: 30px;
  }
`;

const StyledLink = styled.a`
  color: ${({ theme }) => theme.colors.forestGreen};
  text-decoration: underline;
  text-decoration-color: transparent;

  &:hover {
    text-decoration-color: ${({ theme }) => theme.colors.forestGreen};
  }
`;

const Header = () => {
  return (
    <HeaderWrapper>
      <LinkContainer>
        <Link href="/">
          <StyledLink href="/">Posts</StyledLink>
        </Link>
      </LinkContainer>
      <LinkContainer>
        <Link href="/projects">
          <StyledLink href="/">Projects</StyledLink>
        </Link>
        <Link href="/contact">
          <StyledLink href="/">Contact</StyledLink>
        </Link>
      </LinkContainer>
    </HeaderWrapper>
  );
};

export default Header;
