import Login from '../../components/LoginForm'
import colors from '../../utils/style/colors'
import styled from 'styled-components';

const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-bottom: 50px;
`

function Connexion(){
    return(
        <PageContainer>
            <h1>CONNEXION</h1>
            <Login/>
        </PageContainer>
    )
}

export default Connexion;