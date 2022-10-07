import styled from 'styled-components';
import colors from '../../utils/style/colors';
import { useState } from 'react';
import {Navigate} from 'react-router-dom';

const SignupContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 50px;
`
const StyledForm = styled.form`
    display: flex;
    flex-direction: column;
    width: 500px;
    align-items: center;
    border: 1px solid black;
    gap: 15px;
    padding: 20px 0;
`
function Signup(){
    const [inputs, setInputs] = useState({});
    const [error,setError] = useState("");
    const [errorRepeatPassword, setErrorRepeatPassword] = useState(false);
    const [redirect, setRedirect] = useState(false);

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setInputs(values => ({...values, [name]: value}))
    };
    const handleDialog = () =>{
        setRedirect(true)
    }

    const handleSubmit = (e) => {
        setError("");
        setErrorRepeatPassword(false);
        e.preventDefault();
        if(inputs.password === inputs.repeatPassword){
            fetch('http://localhost:3000/api/auth/signup', {
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
                    setError(data);
                    document.getElementById('signupDialog').show();
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
            <StyledForm method="post" onSubmit={handleSubmit}>
                <label>Email :</label>
                <input type="email" name="email" value={inputs.email || ""} onChange={handleChange}/>
                
                <label>Mot de passe :</label>
                <input type="password" name="password" value={inputs.password || ""} onChange={handleChange}/>
                
                <label>Répétition mot de passe :</label>
                <input type="password" name="repeatPassword" value={inputs.repeatPassword || ""} onChange={handleChange}/>
                {errorRepeatPassword ? <p>Votre mot de passe ne correspond pas à celui déjà entré !</p> : null}
                {error.error ? <p>{error.error}</p> : (
                    <dialog id='signupDialog'>
                        <p>{error.message}</p>
                        <button onClick={handleDialog}>OK</button>
                    </dialog>
                )}
                {redirect ? <Navigate replace to="/connexion"/> : null}
                <input type="submit"/>
            </StyledForm>
        </SignupContainer>
    )
}

export default Signup