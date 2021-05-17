import styled from "styled-components";
import { media } from "../lib/theme";

const FooterWrapper = styled.div`
  position: relative;

  ${media.lg} {
    padding: 30px 40px 40px;
  }
`;

const LineOne = styled.svg`
  display: block;
  position: absolute;
  bottom: 0;
  left: 0;
`;

const LineTwo = styled.svg`
  display: block;
  position: absolute;
  bottom: 150px;
  right: 0;
`;

const FooterEle = styled.footer`
  background-color: ${({ theme }) => theme.colors.peachyLight};
  margin-top: 30px;
  padding: 70px 16px;
  text-align: center;
`;

const Footer = () => {
  return (
    <FooterWrapper>
      <LineOne width="231" height="194" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M-.189 18.686c6.604-2.259 15.317-5.074 27.39-8.702 9.833-2.955 20.493-10.782 30.013-6.93l3.588.562c48.402 19.59 30.844 61.43 58.086 97.117 7.034 9.214 18.767 12.204 27.889 18.532.919.637 13.934 3.813 18.372 6.023 12.815 6.383 24.669 17.405 34.52 26.953 17.769 17.223 24.035 29.3 28.635 42.344"
          stroke="#FEAAB9"
          strokeWidth="5"
          fill="none"
          fillRule="evenodd"
          strokeDasharray="10"
        />
      </LineOne>
      <LineTwo width="99" height="378" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M101.978 376.687c-40.185-40.175-22.32-19.058-72.824-60.355-7.948-6.499-20.398-10.96-22.527-21.006l-1.541-3.289c-10.826-51.08 33.68-59.922 48.032-102.462 3.706-10.984-.377-22.384-.231-33.484.014-1.118-4.631-13.684-5.28-18.6-1.875-14.193.634-30.184 3.041-43.69C59.52 44.03 77.434 46.068 100.683 1.242"
          stroke="#FEAAB9"
          strokeWidth="5"
          fill="none"
          fillRule="evenodd"
          strokeDasharray="10"
        />
      </LineTwo>
      <FooterEle>
        <p>
          Check me out on <a href="https://github.com/adrhumphreys/">Github</a>.
          <br /> Made in NZ, by Adrian <br />
          Get in touch via:{" "}
          <a href="mailto:adrhumphreys@gmail.com">adrhumphreys@gmail.com</a>,
          <br /> I would ❤️ to hear from you
        </p>
      </FooterEle>
    </FooterWrapper>
  );
};

export default Footer;
