import Login from '../../components/LoginForm'
import styled from 'styled-components';

const StyledTitle = styled.h1`
    text-align: center;
`

function Connexion(){
    return(
        <div>
            <StyledTitle>CONNEXION</StyledTitle>
            <Login/>
        </div>
    )
}

export default Connexion;