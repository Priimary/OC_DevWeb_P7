import styled from 'styled-components';
import colors from '../../utils/style/colors';
import {useState} from 'react';
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
function NewPost({postId, tokenAuth, title, content, imgUrl, postUpdated, setPostUpdated}){
    const [inputs, setInputs] = useState({title: title, content: content});
    const [image, setImage] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [error, setError] = useState("");
    const [confirmation, setConfirmation] = useState(false);


    const handleDialog = () => {
        if(openDialog){
            setOpenDialog(false)
        }
        else{setOpenDialog(true)}
    }

    const handleReload = () => {
        setPostUpdated(true);
        setOpenDialog(false);
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
        if(image){
            formData.append('image', image);
        }
        fetch(`http://localhost:3000/api/posts/${postId}`, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + tokenAuth,
            },
            body: formData,
        })
        .then((res) => res.json())
        .then((data) => {
            if(data.error){
                setError(data);
            }
            else{
                setError(data);
                setConfirmation(true);
            }
        })
        .catch((err) => {console.log(err, 'ERR')})
    }

    return(
        <>
        <button onClick={handleDialog}>MODIFIER LE POST</button>
        <dialog open={openDialog}>
            {confirmation ? 
            (<>
                <p>{error.message}</p>
                <button onClick={handleReload}>OK</button>
            </>)
            : (
                <>
                <button onClick={handleDialog}>X</button>
                <StyledForm method="post" onSubmit={handleSubmit}>
                    <label>Titre du post :</label>
                    <input type="text" name="title" value={inputs.title || title}  onChange={handleChangeInputs} required/>
                        
                    <label>Veuillez écrire votre message :</label>
                    <input type="textarea" name="content" value={inputs.content || content} onChange={handleChangeInputs} required/>
                        
                    <label>Choisissez l'image que vous souhaitez envoyer :</label>
                    <input type="file" name="image" onChange={handleChangeImage} accept="image/png, image/jpeg, image/jpg"/>
                    {error ? <p>{error.error}</p> : null}
                    <input type="submit"/>
                </StyledForm>
                </>
            )}
        </dialog>
        </>
    )
}

export default NewPost