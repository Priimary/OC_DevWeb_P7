import styled from "styled-components";

const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-bottom: 50px;
`

function Error(){
    return(
        <PageContainer>
            <h1>Oups, cette page n'existe pas !</h1>
        </PageContainer>
    )
}

export default Error