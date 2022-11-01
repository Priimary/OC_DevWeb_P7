import styled from 'styled-components';
import colors from '../../utils/style/colors';
import {useState} from 'react';
import {Navigate} from 'react-router-dom';

const StyledAddBtn = styled.button`
    align-self: center;
    margin-bottom: 50px;
    width: 100px;
    padding: 10px 0;
    color: ${colors.tertiary};
    background-color: ${colors.backgroundColor};
    box-shadow: 0 1px 1px ${colors.tertiary};
    border: 1px solid ${colors.tertiary};
    border-radius: 5px;
    font-size: 16px;
    font-weight: bold;
    transition: 200ms;
    &:hover{
        cursor: pointer;
        box-shadow: 0 2px 2px 2px ${colors.tertiary};
    }
`

const StyledAddIcon = styled.i`
    margin-right: 5px;
`

const StyledCloseBtn = styled.button`
    position: absolute;
    right: 15px;
    color: ${colors.tertiary};
    background-color: ${colors.backgroundColor};
    border: 1px solid ${colors.tertiary};
    border-radius: 15px;
    transition: 200ms;
    padding: 0 5px;
    &:hover{
        cursor: pointer;
        box-shadow: 0 1px 1px 1px ${colors.tertiary};
    }


`

const StyledXMarkIcon = styled.i`
    font-size: 20px;
`

const StyledDialog = styled.dialog`
    border: 3px solid ${colors.primary};
    box-shadow: 0 1px 5px 1px ${colors.tertiary};
    background-color: ${colors.secondary};
    border-radius: 10px;
    position: fixed;
    top: 30px;
    padding: 20px;
    width: 600px;

    @media all and (max-width: 768px){
        width: 80%;
        margin: 0 auto;
    }
    
`

const StyledForm = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
`

const StyledLabel = styled.label`
    color: ${colors.tertiary};
    font-size: 18px;
    text-decoration: underline;
    font-weight: bold;
`

const StyledInputTitle = styled.input`
    color: ${colors.tertiary};
    font-size: 18px;
    background-color: ${colors.backgroundColor};
    border: 1px solid ${colors.tertiary};
    border-radius: 5px;
    width: 80%;
`

const StyledInputContent = styled.textarea`
    color: ${colors.tertiary};
    font-size: 18px;
    background-color: ${colors.backgroundColor};
    border: 1px solid ${colors.tertiary};
    border-radius: 5px;
    width: 90%;
    height: 100px;
`

const StyledSubmitImg = styled.input`
    color: ${colors.tertiary};
    background-color: ${colors.backgroundColor};
    border: 1px solid ${colors.tertiary};
    border-radius: 5px;
    padding: 5px 10px;
    font-weight: bold;
    width: 80%;
    transition: 200ms;
    &:hover{
        cursor: pointer;
        box-shadow: 0 1px 2px 1px ${colors.tertiary};
    }
`

const StyledSubmit = styled.input`
    color: ${colors.tertiary};
    background-color: ${colors.backgroundColor};
    border: 1px solid ${colors.tertiary};
    border-radius: 5px;
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
    border: 1px solid ${colors.tertiary};
    box-shadow: 0 1px 1px 1px ${colors.tertiary};
    border-radius: 5px;
    background-color: ${colors.primary};
    font-size: 18px;
    font-weight: bold;
    margin: 0;
    padding: 5px 20px;
`

function NewPostBtn({tokenAuth}){
    const [inputs, setInputs] = useState({});
    const [image, setImage] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [postId, setPostId] = useState("");
    const [error, setError] = useState("");
    const [redirection, setRedirection] = useState(false);

    // ouvre/ferme le dialog à l'appuie sur le bouton
    const handleDialog = () => {
        if(openDialog){
            setOpenDialog(false)
        }
        else{
            setOpenDialog(true)
        }
    }

    // récupère les inputs dans un objet suivant le schéma key:value
    const handleChangeInputs = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setInputs(values => ({...values, [name]: value}))
    };

    const handleChangeImage = (e) => {
        const value = e.target.files[0];
        setImage(value);
    }

    // reset le message d'erreur, puis créé un objet FormData contenant les inputs et la possible image
    // envoie l'objet à l'api, puis si tout est bon redirige sur la page du post entier
    // sinon affiche le message d'erreur
    const handleSubmit = (e) => {
        setError("");
        e.preventDefault();
        const formData = new FormData();
        formData.append('post', JSON.stringify(inputs));
        if(image){
            formData.append('image', image)
        }
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
                setError(data);
            }
            else{
                setPostId(data.postId);
                setRedirection(true);
            }
         })
        .catch((err) => {console.log(err, 'ERR')})
    }

    return(
        <>
        {redirection ? <Navigate to={'/post/' + postId}/> : null}

        <StyledAddBtn onClick={handleDialog}><StyledAddIcon className="fa-solid fa-plus"/>POST</StyledAddBtn>

        <StyledDialog open={openDialog}>

            <StyledCloseBtn onClick={handleDialog}><StyledXMarkIcon className="fa-solid fa-xmark"/></StyledCloseBtn>

            <StyledForm method="post" onSubmit={handleSubmit}>
                <StyledLabel>Titre du post :</StyledLabel>
                <StyledInputTitle type="text" name="title" value={inputs.title || ""} onChange={handleChangeInputs} required/>
                        
                <StyledLabel>Veuillez écrire votre message :</StyledLabel>
                <StyledInputContent name="content" value={inputs.content || ""} onChange={handleChangeInputs} required/>
                        
                <StyledLabel>Choisissez l'image que vous souhaitez envoyer :</StyledLabel>
                <StyledSubmitImg type="file" name="image" onChange={handleChangeImage} accept="image/png, image/jpeg, image/jpg"/>

                {error ? <ErrorMsg>{error.error}</ErrorMsg> : null}

                <StyledSubmit type="submit"/>
            </StyledForm>

        </StyledDialog>
        </>
    )
}

export default NewPostBtn