import styled from 'styled-components';
import colors from '../../utils/style/colors';
import { useState} from 'react';
import {Navigate} from 'react-router-dom';

const StyledForm = styled.form`
    display: flex;
    flex-direction: column;
    width: 500px;
    align-items: center;
    border: 1px solid black;
    gap: 15px;
    padding: 20px 0;
`
function NewPost({tokenAuth}){
    const [inputs, setInputs] = useState({});
    const [image, setImage] = useState({});
    const [openDialog, setOpenDialog] = useState(false);
    const [error, setError] = useState("");
    const [confirmation, setConfirmation] = useState(false);
    const [redirection, setRedirection] = useState(false)

    const handleDialog = () => {
        setOpenDialog(true)
    }

    const handleRedirection = () => {
        setRedirection(true);
    }

    const handleChangeInputs = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setInputs(values => ({...values, [name]: value}))
    };

    const handleChangeImage = (e) => {
        const value = e.target.files[0];
        setImage(value);
    }

    const handleSubmit = (e) => {
        setError("");
        e.preventDefault();
        const formData = new FormData();
        formData.append('post', JSON.stringify(inputs));
        formData.append('image', image);
        fetch('http://localhost:3000/api/posts', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + tokenAuth,                    
            },
            body: formData,
        })
        .then((res) => res.json())
        .then((data) => {
            if(data.error){
                setError(data)
            }
            else{
                setError(data)
                setConfirmation(true);
            }
         })
        .catch((err) => {console.log(err, 'ERR')})
    }

    return(
        <>
        {redirection ? <Navigate replace to="/"/> : null}
        <button onClick={handleDialog}>CRÉÉ UN POST</button>
        <dialog open={openDialog}>
            {confirmation ? 
            (<><p>{error.message}</p><button onClick={handleRedirection}>OK</button></>)
            : (
                <StyledForm method="post" onSubmit={handleSubmit}>
                    <label>Titre du post :</label>
                    <input type="Titre" name="title" value={inputs.title || ""} onChange={handleChangeInputs} required/>
                        
                    <label>Veuillez écrire votre message :</label>
                    <input type="text" name="content" value={inputs.content || ""} onChange={handleChangeInputs} required/>
                        
                    <label>Choisissez l'image que vous souhaitez envoyer :</label>
                    <input type="file" name="image" onChange={handleChangeImage} accept="image/png, image/jpeg, image/jpg"/>
                    {error ? <p>{error.error}</p> : null}
                    <input type="submit"/>
                </StyledForm>
            )}
        </dialog>
        </>
    )
}

export default NewPost