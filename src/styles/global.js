import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    outline: 0;
    transition: all 300ms;
    box-sizing: border-box;
  }

  html, body, #root {
    min-height: 100vh;
  }

  body {
    background: white;
    -webkit-font-smoothing: antialiased !important;
  }

  a, body, input, button, html {

    font-size: 1rem;
    font-family: 'Montserrat', sans-serif;
    background-color: ${props => props.theme.colors.background};
  }

  button {
    cursor: pointer;
  }

  /* font resizing */

  @media(max-width: 1366px) {
    html {
      font-size: 12px;
    }
  }

  @media(max-width: 1242px) {
    html {
      font-size: 10px;
    }
  }

  @media(max-width: 908px) {
    html {
      font-size: 8px;
    }
  }

  @media(max-width: 710px) {
    html {
      font-size: 13px;
    }
  }

  svg {
  display: inline-block;
  vertical-align: middle;
}
`;
