import PropTypes from 'prop-types';
import styled from 'styled-components';
import colors from '../../utils/style/colors';
import {useState} from 'react';
import {Navigate} from 'react-router-dom';


const PostTitle = styled.h2`
    color: #5843e4;
    font-size: 22px;
    font-weight: bold;
`
const PostImg = styled.img`
    width: 20%;
    padding: 5px;
    border: 1px solid black;
    border-radius: 5%;
    &:hover{
        box-shadow: 0 0 2px 1px black;
    }
`

const PostWrapper = styled.div`
    display: flex;
    flex-direction: column;
    padding: 15px;
    background-color: ${colors.backgroundLight};
    border-radius: 30px;
    transition: 200ms;
    &:hover{
        cursor: pointer;
        box-shadow: 2px 2px 10px #e2e3e9;
    }
`
function FullPost({postId, postUserId, userId, tokenAuth, title, content, imgUrl, createdAt, updatedAt}){
    const [openModifyDialog, setOpenModifyDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [redirect, setRedirect] = useState(false);
    const [error, setError] = useState("");

    const handleRedirect = () => {
        setRedirect(true)
    }

    const handleModify = () => {
        setOpenModifyDialog(true);
    }

    const handleDelete = () => {
        fetch(`http://localhost:3000/api/posts/${postId}`, {
            'method' : 'DELETE',
            headers: {
                'authorization' : 'Bearer ' + tokenAuth
            }
        })
        .then((resp) => resp.json())
        .then((res) => {
            if(res.error){
                setError(res)
            }
            else{
                setError(res);
                setOpenDeleteDialog(true);    
            }
        })
        .catch((err) => console.log(err))
    }

    return(
        <PostWrapper>
            {redirect ? <Navigate to="/"/> : null}
            <PostTitle>{title}</PostTitle>
            <span>{content}</span>
            {imgUrl != null ? 
            (<a href={`${imgUrl}`}>
                <PostImg src={imgUrl} alt=""/>
            </a>) : null}
            <p>Post créé le : {createdAt}</p>
            {updatedAt !== createdAt ? <p>Modifié le : {updatedAt}</p> : null}
            {postUserId === userId ? (<>
                <button onClick={handleModify}>Modify</button>
                <button onClick={handleDelete}>Delete</button>
                <dialog open={openModifyDialog}><p>coucou</p></dialog>
                <dialog open={openDeleteDialog}><p>{error.message || error.error}</p><button onClick={handleRedirect}>OK</button></dialog>
            </>)
            : null}
            
        </PostWrapper>
    )
}

FullPost.propTypes = {
    postId: PropTypes.number.isRequired,
    postUserId: PropTypes.number.isRequired,
    userId: PropTypes.number.isRequired,
    tokenAuth : PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    imgUrl: PropTypes.string,
    createdAt: PropTypes.string.isRequired,
    updatedAt: PropTypes.string.isRequired
}

export default FullPost
