import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    background-color: #000;
    color: #fff;
    font-family: 'Courier New', monospace;
    height: 100vh;
  }

  #root {
    height: 100%;
  }

  /* Tamaños estándar */
  @media (min-width: 1200px) {
    html {
      font-size: 18px;
    }
  }

  @media (max-width: 1199px) and (min-width: 992px) {
    html {
      font-size: 16px;
    }
  }

  @media (max-width: 991px) and (min-width: 768px) {
    html {
      font-size: 15px;
    }
  }

  @media (max-width: 767px) {
    html {
      font-size: 14px;
    }
  }

  @media (max-width: 480px) {
    html {
      font-size: 13px;
    }
  }
`;