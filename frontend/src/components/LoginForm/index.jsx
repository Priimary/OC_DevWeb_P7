import styled from 'styled-components';
import colors from '../../utils/style/colors';
import {useState, useEffect} from 'react';
import {Navigate, Link} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';
import {login} from '../../features/auth/authSlice'

const StyledLink = styled(Link)`
    color: ${colors.tertiary};
`
const LoginContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`
const StyledForm = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    width: 500px;
    padding: 15px;
    border: 3px solid ${colors.tertiary};
    background-color: ${colors.backgroundColor};
    box-shadow: 0 1px 15px 3px ${colors.tertiary};
    font-size: 18px;
    font-weight: bold;
`

const FormLabel = styled.label`
    color: ${colors.tertiary};
    text-decoration: underline;
`

const FormInput = styled.input`
    color: ${colors.tertiary};
    font-size: 18px;
    background-color: ${colors.secondary};
    border: 1px solid ${colors.tertiary};
    border-radius: 5px;
`

const SubmitBtn = styled.input`
    color: ${colors.tertiary};
    background-color: ${colors.secondary};
    border: 1px solid ${colors.tertiary};
    border-radius: 15px;
    padding: 5px 10px;
    font-size: 16px;
    font-weight: bold;
    text-transform: uppercase;
    transition: 200ms;
    &:hover{
        cursor: pointer;
        box-shadow: 0 1px 2px 1px ${colors.tertiary};
    }
`

const ErrorMsg = styled.p`
    text-align: center;
    text-decoration: none;
    font-size: 18px;
    margin: 0;
    color: ${colors.primary};
`

function Login(){
    const [inputs, setInputs] = useState({});
    const [error, setError] = useState("");
    const [redirect, setRedirect] = useState(false);
    const dispatch = useDispatch();
    const storeConnected = useSelector((state) => state.auth.value);

    // vérification si connecté via store redux
    useEffect(() => {
        if(storeConnected){
            setRedirect(true);
        }
    }, [storeConnected]);
    
    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setInputs(values => ({...values, [name]: value}))
    };

    // reset le state de l'erreur puis envoie les données à l'api
    // si tout est bon envoie un objet contenant l'userId, roleId, token & date d'expiration du token en localStorage
    // met à jour le state de connexion dans le store redux, et redirige vers la liste des posts
    // sinon indique les erreurs
    const HandleSubmit = (e) => {
        e.preventDefault();
        setError("");
        fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(inputs),
        })
        .then((res) => res.json())
        .then((data) => {
            if(data.error){
                setError(data);
            }
            else{
                localStorage.setItem('user', JSON.stringify(data));
                dispatch(login());
                setRedirect(true);   
            }
        })
        .catch((err) => {console.log(err)})
    };

    return(
        <LoginContainer>
            <StyledForm method="post" onSubmit={HandleSubmit}>
                {redirect ? <Navigate replace to="/"/> : null}
                
                <FormLabel>Adresse email :</FormLabel>
                <FormInput type="email" name="email" value={inputs.email || ""} onChange={handleChange} placeholder="test@gmail.com" required/>

                <FormLabel>Mot de passe :</FormLabel>
                <FormInput type="password" name="password" value={inputs.password || ""} onChange={handleChange} required/>

                {error ? <ErrorMsg>{error.error}</ErrorMsg> : null}

                <SubmitBtn value="CONNEXION" type="submit"/>

                <StyledLink to='/signup'>Vous n'avez pas de compte ? Inscrivez vous !</StyledLink>
            </StyledForm>
        </LoginContainer>
    )
}
export default Login