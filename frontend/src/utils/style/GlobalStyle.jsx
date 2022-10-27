import { createGlobalStyle } from "styled-components"
import colors from '../style/colors'

const StyledGlobalStyle = createGlobalStyle`
  *{
    font-family: Lato, 'Trebuchet MS', sans-serif;
  }
  body{
    margin: 0;
    background-color: ${colors.secondary};
  }
  h1{
    font-size: 40px;
    color: ${colors.primary};
    text-transform: uppercase;
    text-align: center;
    align-self: center;
    border-bottom: 5px solid ${colors.tertiary};
  }
`

function GlobalStyle(){
    return <StyledGlobalStyle/>
}

export default GlobalStyle