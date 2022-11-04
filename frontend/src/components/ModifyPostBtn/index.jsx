import styled from 'styled-components';
import colors from '../../utils/style/colors';
import {useState} from 'react';

const UpdateBtn = styled.button`
    width: 130px;
    color: ${colors.tertiary};
    background-color: ${colors.secondary};
    border: 1px solid ${colors.tertiary};
    border-radius: 15px;
    padding: 5px 0;
    font-size: 18px;
    font-weight: bold;
    text-transform: uppercase;
    transition: 200ms;
    &:hover{
        cursor: pointer;
        box-shadow: 0 1px 2px 1px ${colors.tertiary};
    }
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

const StyledCloseBtn = styled.button`
    position: absolute;
    right: 15px;
    color: ${colors.tertiary};
    background-color: ${colors.backgroundColor};
    border: 1px solid ${colors.tertiary};
    border-radius: 15px;
    padding: 0 5px;
    transition: 200ms;
    &:hover{
        cursor: pointer;
        box-shadow: 0 1px 1px 1px ${colors.tertiary};
    }
`

const StyledXMarkIcon = styled.i`
    font-size: 20px;
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
    transition: 200ms;
    width: 80%;
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

const SuccessMsg = styled.p`
    color: green;
    font-size: 18px;
    margin: 0;
`

const ButtonContainer = styled.div`
    display: flex;
    justify-content: center;
`

const StyledBtn = styled.button`
    color: ${colors.tertiary};
    background-color: ${colors.backgroundColor};
    border: 1px solid ${colors.tertiary};
    border-radius: 5px;
    margin-top: 15px;
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

function ModifyPostBtn({postId, tokenAuth, title, content, postUpdated, setPostUpdated}){
    const [inputs, setInputs] = useState({title: title, content: content});
    const [image, setImage] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [error, setError] = useState("");
    const [confirmation, setConfirmation] = useState(false);

    // ouvre/ferme le dialog suivant son état
    const handleDialog = () => {
        if(openDialog){
            setOpenDialog(false)
        }
        else{
            setOpenDialog(true)
        }
    }

    // met à jour la page après avoir modifié le post
    const handleReload = () => {
        setPostUpdated(true);
        setOpenDialog(false);
    }

    // récupère les valeurs du formulaire dans un format key:value
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
    // envoie l'objet à l'api, puis si tout est bon affiche le message de succès de l'API, sinon affiche le message d'erreur
    // lors du clique sur le bouton OK, remonte le statut de PostUpdated, et reload la page
    const handleSubmit = (e) => {
        setError("");
        e.preventDefault();
        console.log(inputs.content);
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
            <UpdateBtn onClick={handleDialog}>MODIFIER</UpdateBtn>
            <StyledDialog open={openDialog}>
                {confirmation ? 
                (<>
                    <SuccessMsg>{error.message}</SuccessMsg>
                    <ButtonContainer>
                        <StyledBtn onClick={handleReload}>OK</StyledBtn>
                    </ButtonContainer>
                </>)
                : 
                (
                    <>
                        <StyledCloseBtn onClick={handleDialog}><StyledXMarkIcon className="fa-solid fa-xmark"/></StyledCloseBtn>
                        <StyledForm method="post" onSubmit={handleSubmit}>
                            <StyledLabel>Titre du post :</StyledLabel>
                            <StyledInputTitle type="text" name="title" value={inputs.title || title}  onChange={handleChangeInputs} required/>
                                
                            <StyledLabel>Veuillez écrire votre message :</StyledLabel>
                            <StyledInputContent name="content" value={inputs.content || content} onChange={handleChangeInputs} required/>
                                
                            <StyledLabel>Choisissez l'image que vous souhaitez envoyer :</StyledLabel>
                            <StyledSubmitImg type="file" name="image" onChange={handleChangeImage} accept="image/png, image/jpeg, image/jpg"/>

                            {error ? <ErrorMsg>{error.error}</ErrorMsg> : null}

                            <StyledSubmit value="MODIFIER" type="submit"/>
                        </StyledForm>
                    </>
                )
            }
            </StyledDialog>
        </>
    )
}

export default ModifyPostBtn