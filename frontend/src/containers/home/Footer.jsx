import React from 'react';
import styled from 'styled-components';

const StyledFooter = {
  container: styled.div`
    position: relative;
    padding: 6.25rem 0;
    background-color: #fff7f7;
    color: #090e36;
    font-family: 'SCD_bold';
    z-index: -5;
    @media only screen and (max-width: 480px) {
      padding: 2.25rem 0;
    }
  `,
  rowBox: styled.div`
    display: flex;
    justify-content: space-evenly;
    align-items: center;
  `,
};
const FooterLogo = styled.img.attrs({ src: '/logo.png' })`
  width: 50%;
  object-fit: cover;
  margin: 0;
  @media only screen and (max-width: 768px) {
    width: 80%;
  }
`;
const FooterLeft = {
  container: styled.div`
    width: 25%;
    @media only screen and (max-width: 768px) {
      width: 45%;
    }
  `,
  info: styled.div`
    font-size: 17px;
    font-weight: bold;
    font-family: 'SCD_bold';
    width: fit-content;
    margin: 10px;
    color: black;
    @media only screen and (max-width: 768px) {
      font-size: 0.8rem;
    }
    @media only screen and (max-width: 480px) {
      font-size: 10px;
    }
  `,
};

const FooterNav = {
  container: styled.div`
    width: 25%;
    @media only screen and (max-width: 768px) {
      width: 45%;
    }
  `,
  menu: styled.div`
    font-size: 1.5rem;
    font-weight: bold;
    font-family: 'SCD_bold';
    width: auto;
    margin-top: 10px;
    margin-bottom: 10px;
    color: black;
    @media only screen and (max-width: 768px) {
      font-size: 1.25rem;
    }
    @media only screen and (max-width: 480px) {
      font-size: 15px;
    }
  `,
};
export default function Footer() {
  return (
    <StyledFooter.container>
      <StyledFooter.rowBox>
        <FooterLeft.container>
          <FooterLogo />
          <FooterLeft.info>@Co-Fix. All rights reserved.</FooterLeft.info>
          <FooterLeft.info>Privacy Policy</FooterLeft.info>
        </FooterLeft.container>
        <FooterNav.container>
          <FooterNav.menu>Home</FooterNav.menu>
          <FooterNav.menu>History</FooterNav.menu>
          <FooterNav.menu>Start Co-Fix Project</FooterNav.menu>
          <FooterNav.menu>Contact Us</FooterNav.menu>
        </FooterNav.container>
      </StyledFooter.rowBox>
    </StyledFooter.container>
  );
}
