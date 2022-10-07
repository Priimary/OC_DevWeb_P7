import styled from 'styled-components';
import colors from '../../utils/style/colors';
import { useState } from 'react';
import { Navigate } from 'react-router-dom';

const LoginContainer = styled.div`
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

function Login(){
    const [inputs, setInputs] = useState({});
    const [error, setError] = useState("");
    const [redirect, setRedirect] = useState(false);
    
    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setInputs(values => ({...values, [name]: value}))
    };

    const handleSubmit = (e) => {
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
                setRedirect(true);
            }
        })
        .catch((err) => {console.log(err)})
    };

    return(
        <LoginContainer>
            <StyledForm method="post" onSubmit={handleSubmit}>
                <label>Email :</label>
                <input type="email" name="email" value={inputs.email || ""} onChange={handleChange}/>
                <label>Mot de passe :</label>
                <input type="password" name="password" value={inputs.password || ""} onChange={handleChange}/>
                {error ? <p>{error.error}</p> : null}
                {redirect ? <Navigate replace to="/"/> : null}
                <input value="CONNEXION" type="submit"/>
            </StyledForm>
        </LoginContainer>
    )
}
export default Login