import Link from "next/link";
import styled from "styled-components";
import { media, typography } from "../lib/theme";

export const IntroWrapper = styled.header`
  background-color: ${({ theme }) => theme.colors.peachyLight};
  margin-bottom: 30px;
  padding: 50px 16px;

  ${media.lg} {
    padding: 65px 80px 100px;
  }

  ${media.xl} {
    padding-left: 175px;
    padding-right: 175px;
  }
`;

export const Title = styled.h1`
  color: ${({ theme }) => theme.colors.forestGreen};
  font-family: ${typography.noto};
  font-size: 3rem;
  line-height: 1.2;
  margin-bottom: 0;
  margin-top: 0;
`;

const BackLink = styled.a`
  align-items: center;
  color: ${({ theme }) => theme.colors.forestGreen};
  display: flex;
  margin-bottom: 12px;
  text-decoration: none;
`;

const SVGContainer = styled.svg`
  display: inline-block;
  margin-right: 4px;
`;

const Intro = ({ children }) => {
  return (
    <IntroWrapper>
      <Link href="/">
        <BackLink href="/">
          <SVGContainer
            width="24"
            height="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g fill="none" fillRule="evenodd">
              <path d="M24 0H0v24h24z" />
              <path
                fill="#008564"
                fillRule="nonzero"
                d="M7.99 11H20v2H7.99v3L4 12l3.99-4z"
              />
            </g>
          </SVGContainer>
          Go back to posts
        </BackLink>
      </Link>
      <Title>{children}</Title>
    </IntroWrapper>
  );
};

export default Intro;
