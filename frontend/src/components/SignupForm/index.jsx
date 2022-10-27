import styled from 'styled-components';
import colors from '../../utils/style/colors';
import { useState, useEffect } from 'react';
import {Navigate, Link} from 'react-router-dom';
import {useSelector} from 'react-redux';

const StyledLink = styled(Link)`
    color: ${colors.tertiary};
`

const SignupContainer = styled.div`
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

const SuccessMsg = styled.p`
    color: green;
    font-size: 18px;
    text-align: center;
    margin: 0;
`

const DialogBtn = styled.button`
    color: ${colors.tertiary};
    background-color: ${colors.backgroundColor};
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

const DialogBox = styled.dialog`
    display: flex;
    flex-direction: column;
    gap: 20px;
    border: 3px solid ${colors.primary};
    box-shadow: 0 1px 5px 1px ${colors.tertiary};
    background-color: ${colors.secondary};
    border-radius: 10px;
    position: fixed;
    top: 30px;
    padding: 20px;
`



function Signup(){
    const [FormInputs, setFormInputs] = useState({});
    const [error,setError] = useState("");
    const [errorRepeatPassword, setErrorRepeatPassword] = useState(false);
    const [redirect, setRedirect] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
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
        setFormInputs(values => ({...values, [name]: value}))
    };

    // ferme le dialog et redirige sur la page de connexion si tout est bon
    const handleRedirect = () =>{
        setOpenDialog(false);
        setRedirect(true);
    }

    // reset les state des erreurs, vérifie si les mot de passes sont identiques, puis envoie les données à l'api
    // si tout est bon ouvre le dialog affichant le message de réussite/bouton de redirection
    // sinon indique les erreurs
    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");
        setErrorRepeatPassword(false);
        if(FormInputs.password === FormInputs.repeatPassword){
            fetch('http://localhost:3000/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(FormInputs),
            })
            .then((res) => res.json())
            .then((data) => {
                if(data.error){
                    setError(data);
                }
                else{
                    setError(data);
                    setOpenDialog(true);
                }
            })
            .catch((err) => {console.log(err, 'ERR')})
        }
        else{
            setErrorRepeatPassword(true)
        }
    }

    return(
        <SignupContainer>
            {redirect ? <Navigate replace to="/connexion"/> : null}
            <StyledForm method="post" onSubmit={handleSubmit}>
                <FormLabel>Email :</FormLabel>
                <FormInput type="email" name="email" value={FormInputs.email || ""} onChange={handleChange} placeholder="test@gmail.com" required/>
                
                <FormLabel>Mot de passe :</FormLabel>
                <FormInput type="password" name="password" value={FormInputs.password || ""} onChange={handleChange} required/>
                
                <FormLabel>Répétition mot de passe :</FormLabel>
                <FormInput type="password" name="repeatPassword" value={FormInputs.repeatPassword || ""} onChange={handleChange} required/>

                {errorRepeatPassword ? <ErrorMsg>Votre mot de passe ne correspond pas à celui déjà entré !</ErrorMsg> : null}
                {error.error ? <ErrorMsg>{error.error}</ErrorMsg> : null}

                <SubmitBtn value="INSCRIPTION" type="submit"/>

                <StyledLink to='/connexion'>Vous avez déjà un compte ? Connectez vous !</StyledLink>

                {openDialog ? (
                <DialogBox open={openDialog}>
                    <SuccessMsg>{error.message}</SuccessMsg>
                    <DialogBtn onClick={handleRedirect}>CONNEXION</DialogBtn>
                </DialogBox>) : null} 
            </StyledForm>
        </SignupContainer>
    )
}

export default Signup