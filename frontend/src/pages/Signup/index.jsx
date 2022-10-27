import Signup from '../../components/SignupForm';
import styled from 'styled-components';

const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-bottom: 50px;
`

function Inscription(){
    return(
        <PageContainer>
            <h1>INSCRIPTION</h1>
            <Signup/>
        </PageContainer>
    )
}

export default Inscription;