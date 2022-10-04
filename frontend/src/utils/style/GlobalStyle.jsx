import { createGlobalStyle } from "styled-components"

const StyledGlobalStyle = createGlobalStyle`
  *{
    font-family: Lato, 'Trebuchet MS', sans-serif;
  }
  body{
    margin: 0;
  }
`

function GlobalStyle(){
    return <StyledGlobalStyle/>
}

export default GlobalStyle