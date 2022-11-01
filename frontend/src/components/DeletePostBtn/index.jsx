import styled from "styled-components"
import colors from '../../utils/style/colors';
import { useState } from "react";
import { Navigate } from "react-router-dom";

const DeleteBtn = styled.button`
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

    @media all and (max-width: 768px){
        width: 80%;
        margin: 0 auto;
    }
`

const ConfirmationBtn = styled.button`
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

const DialogBtnContainer = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 15px;
    gap: 60px;
`

const DialogMsg = styled.p`
    color: ${colors.tertiary};
    font-size: 18px;
    font-weight: bold;
    margin: 0;
`

function DeletePostBtn({postId, tokenAuth}){
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [redirect, setRedirect] = useState(false);
    const [confirmation, setConfirmation] = useState(false);
    const [error, setError] = useState("");

    // ouvre/ferme le dialog suivant son état
    const handleDialog = () => {
        if(isDialogOpen){
            setIsDialogOpen(false)
        }
        else{
            setIsDialogOpen(true)
        }
    }

    const handleRedirect = () => {
        setRedirect(true);
    }

    // envoie une requête delete à l'api avec le token d'authentification de l'utilisateur
    // change les états pour afficher le message qui affiche le retour de l'api et un bouton pour renvoyer à la liste des posts
    const handleDelete = (e) => {
        e.preventDefault();
        setError("");
        fetch(`http://localhost:3000/api/posts/${postId}`, {
            'method' : 'DELETE',
            headers: {
                'authorization' : 'Bearer ' + tokenAuth
            }
        })
        .then((resp) => resp.json())
        .then((res) => {
            setConfirmation(true);
            setError(res);
        })
        .catch((err) => console.log(err))
    }

    return(
        <>
            {redirect ? <Navigate to='/'/> : null}
            <DeleteBtn onClick={handleDialog}>SUPPRIMER</DeleteBtn>
            <StyledDialog open={isDialogOpen}>
                {confirmation ?
                        (
                            <>
                                <DialogMsg>{error.message || error.error}</DialogMsg>
                                <DialogBtnContainer>
                                    <ConfirmationBtn onClick={handleRedirect}>OK</ConfirmationBtn>
                                </DialogBtnContainer>
                            </>
                        )
                    :
                        (
                            <>
                                <DialogMsg>Êtes-vous sûr de vouloir supprimer ce post ?</DialogMsg>
                                <DialogBtnContainer>
                                    <ConfirmationBtn onClick={handleDelete}>OUI</ConfirmationBtn>
                                    <ConfirmationBtn onClick={handleDialog}>NON</ConfirmationBtn>
                                </DialogBtnContainer>
                            </>
                        )
                }
            </StyledDialog>
        </>
    )
}

export default DeletePostBtn