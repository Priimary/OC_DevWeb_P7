import {Link, Navigate} from 'react-router-dom';
import styled from 'styled-components';
import colors from '../../utils/style/colors';
import Logo from '../../assets/icon-left-font-monochrome-black.png';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {logout, login} from '../../features/auth/authSlice'


const HeaderContainer = styled.nav`
    background-color: white;
    display: flex;
    padding: 15px;
    height: 80px;
    justify-content: center;
    border-bottom: 2px solid ${colors.tertiary};
    
    @media all and (max-width: 768px){
        gap: 15px;
        flex-direction: column;
        height: auto;
    }
`;

const LogoImg = styled.img`
    height: 100%;

    @media all and (max-width: 768px){
        width: 100%;
    }
`;

const LogoLink = styled(Link)`
    width: 50%;
    text-align: start;
    ${(props) => 
        props.$isCenter && 
        `
        width: 100%;
        text-align: center;
        `
    }

    @media all and (max-width: 768px){
        width: 100%;
    }
`;

const DisconnectLink = styled(Link)`
    display: flex;
    justify-content: flex-end;
    align-items: end;
    color: ${colors.tertiary};
    font-size: 18px;
    text-decoration: none;
    width: 50%;

    @media all and (max-width: 768px){
        align-self: center;
        justify-content: center;
    }
`
const LogOffIcon = styled.i`
    line-height: 1.2;
    color: ${colors.primary};
    margin-right: 5px;
`

const DisconnectText = styled.p`
    margin: 0;
`

function Header(){
    const [isConnected, setIsConnected] = useState(false);
    const [redirect, setRedirect] = useState(false);
    const storeConnected = useSelector((state) => state.auth.value)
    const dispatch = useDispatch();

    // vérification si l'utilisateur est connecté grâce au localstorage & au store redux
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
            {isConnected ? (<LogoLink to='/'><LogoImg src={`${Logo}`} alt="Logo Groupomania" /></LogoLink>) : (<LogoLink to='/connexion' $isCenter><LogoImg src={`${Logo}`} alt="Logo Groupomania"/></LogoLink>)}
            {isConnected ? (<DisconnectLink to='/connexion' onClick={handleLogout}><LogOffIcon className="fa-solid fa-power-off"/><DisconnectText>Déconnexion</DisconnectText></DisconnectLink>) : null}
        </HeaderContainer>
    )
}

export default Header