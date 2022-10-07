import Signup from '../../components/SignupForm';
import styled from 'styled-components';

const StyledTitle = styled.h1`
    text-align: center;
`
function Inscription(){
    return(
        <div>
            <StyledTitle>INSCRIPTION</StyledTitle>
            <Signup/>
        </div>
    )
}

export default Inscription;