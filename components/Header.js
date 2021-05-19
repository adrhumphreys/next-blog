import styled from "styled-components";
import Link from "next/link";
import { media } from "../lib/theme";
import React from "react";
import { useRouter } from "next/router";

const HeaderWrapper = styled.header`
  display: flex;
  justify-content: space-between;
  padding: 20px 16px;

  ${media.lg} {
    margin-left: 40px;
    margin-right: 40px;
  }
`;

const LinkContainer = styled.p`
  margin-top: 0;
  margin-bottom: 0;

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

const ActiveLink = styled(StyledLink)`
  text-decoration-color: ${({ theme }) => theme.colors.forestGreen};
`;

const Header = () => {
  const { asPath } = useRouter();

  const ProjectsLink = asPath === "/projects" ? ActiveLink : StyledLink;
  const ContactLink = asPath === "/contact" ? ActiveLink : StyledLink;

  const PostsLink = ["/projects", "/contact"].some((link) => link === asPath)
    ? StyledLink
    : ActiveLink;

  return (
    <HeaderWrapper>
      <LinkContainer>
        <Link href="/">
          <PostsLink href="/">Posts</PostsLink>
        </Link>
      </LinkContainer>
      <LinkContainer>
        <Link href="/projects">
          <ProjectsLink href="/projects">Projects</ProjectsLink>
        </Link>
        <Link href="/contact">
          <ContactLink href="/contact">Contact</ContactLink>
        </Link>
      </LinkContainer>
    </HeaderWrapper>
  );
};

export default Header;
