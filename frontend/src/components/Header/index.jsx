import {Link, Navigate} from 'react-router-dom';
import styled from 'styled-components';
import colors from '../../utils/style/colors';
import Logo from '../../assets/icon-left-font-monochrome-black2.png';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {logout, login} from '../../features/auth/authSlice'

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
    const [isConnected, setIsConnected] = useState(false);
    const [redirect, setRedirect] = useState(false);
    const storeConnected = useSelector((state) => state.auth.value)
    const dispatch = useDispatch();

    // handle auth
    useEffect(() => {
        if(storeConnected === false){
            setIsConnected(false);
        }
        const userStr = localStorage.getItem('user');
        if(userStr){
            const user = JSON.parse(userStr);
            const now = new Date();
            if(now.getTime() > user.expiry){
                dispatch(logout());
                setRedirect(true);
            }
            else{
                setIsConnected(true);
                dispatch(login());
            }
        }
    }, [storeConnected, dispatch]);
    
    const handleLogout = () => {
        dispatch(logout());
        setIsConnected(false);
    }
    
    return(
        <HeaderContainer>
            {redirect ? (<Navigate to="/connexion"/>) : null}
            {isConnected ? (<StyledLink to='/'><LogoImg src={`${Logo}`} alt="Logo Groupomania"/></StyledLink>) : (<StyledLink to='/connexion'><LogoImg src={`${Logo}`} alt="Logo Groupomania"/></StyledLink>)}
            {isConnected ? (<StyledLink to='/connexion' onClick={handleLogout} $isRight>Déconnexion</StyledLink>) : null}
        </HeaderContainer>
    )
}

export default Header