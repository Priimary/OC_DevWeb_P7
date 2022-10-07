import {Link} from 'react-router-dom';
import styled from 'styled-components';
import colors from '../../utils/style/colors';
import Logo from '../../assets/icon-left-font-monochrome-black2.png';

const StyledLink = styled(Link)`
    padding: 15px;
    color: #8186a0;
    text-decoration: none;
    font-size: 18px;
    width: 50%;
    ${(props) =>
        props.$isRight &&
        `
        display: flex;
        flex-direction: column;
        text-align: right;
        justify-content: flex-end;
        `}
`;
const LogoImg = styled.img`
    height: 100%;
`;
const HeaderContainer = styled.nav`
    display: flex;
    height: 100px;
`;

function Header(){
    return(
        <HeaderContainer>
            <StyledLink to='/'><LogoImg src={`${Logo}`} alt="Logo Groupomania"/></StyledLink>
            <StyledLink to='/connexion'>Connexion</StyledLink>
            <StyledLink to='/disconnect' $isRight>Déconnexion</StyledLink>
            <StyledLink to='/signup'>Inscription</StyledLink>
        </HeaderContainer>
    )
}

export default Header