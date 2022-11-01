import {useState} from 'react';
import colors from '../../utils/style/colors';
import styled from 'styled-components';

const LikeContainer = styled.div`
    display: flex;
    gap: 30px;
`;

const LikeBtn = styled.button`
    width: 50px;
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
`;

const ThumbsIcon = styled.i`
    margin-right: 5px;
    ${(props) => 
        props.isGreen && 
        `
        color: green;
        `
    }
    ${(props) => 
         props.isRed && 
        `
        color: red;
        `
    }
`;


function LikesDislikesBtn({postId, tokenAuth, likes, dislikes, userLike}){
    const [isLike, setIsLike] = useState(userLike);
    const [countDislike, setCountDislike] = useState(dislikes);
    const [countLike, setCountLike] = useState(likes);
    const likeIcon = document.getElementsByClassName('fa-thumbs-up');
    const dislikeIcon = document.getElementsByClassName('fa-thumbs-down');
    const like = {like: 1};
    const dislike = {like: 0};
    const delVote = {like: -1};

    const handleLike = () => {
        if(isLike === 1){
            fetch(`http://localhost:3000/api/posts/${postId}/like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + tokenAuth
                },
                body: JSON.stringify(delVote)
            })
            .then((res) => res.json())
            .then((data) => {
                setCountLike(countLike - 1);
                likeIcon[0].style.color = `${colors.tertiary}`;
                setIsLike(null);
            })
            .catch((err) => (console.log(err)))

        }
        else if(isLike === 0){
            fetch(`http://localhost:3000/api/posts/${postId}/like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + tokenAuth
                },
                body: JSON.stringify(like)
            })
            .then((res) => res.json())
            .then((data) => {
                setCountLike(countLike + 1);
                likeIcon[0].style.color = 'green';
                setCountDislike(countDislike - 1);
                dislikeIcon[0].style.color = `${colors.tertiary}`;
                setIsLike(1);
            })
            .catch((err) => (console.log(err)))
        }
        else{
            fetch(`http://localhost:3000/api/posts/${postId}/like`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + tokenAuth
                    },
                    body: JSON.stringify(like)
                })
                .then((res) => res.json())
                .then((data) => {
                    setCountLike(countLike + 1);
                    likeIcon[0].style.color = 'green';
                    setIsLike(1);
                })
                .catch((err) => (console.log(err)))
        }
    }

    const handleDislike = () => {
        if(isLike === 1){
            fetch(`http://localhost:3000/api/posts/${postId}/like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + tokenAuth
                },
                body: JSON.stringify(dislike)
            })
            .then((res) => res.json())
            .then((data) => {
                setCountDislike(countDislike + 1);
                dislikeIcon[0].style.color = 'red';
                setCountLike(countLike - 1);
                likeIcon[0].style.color = `${colors.tertiary}`;
                setIsLike(0);
            })
            .catch((err) => (console.log(err)))

        }
        else if(isLike === 0){
            fetch(`http://localhost:3000/api/posts/${postId}/like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + tokenAuth
                },
                body: JSON.stringify(delVote)
            })
            .then((res) => res.json())
            .then((data) => {
                setCountDislike(countDislike - 1);
                dislikeIcon[0].style.color = `${colors.tertiary}`;
                setIsLike(null);
            })
            .catch((err) => (console.log(err)))
        }
        else{
            fetch(`http://localhost:3000/api/posts/${postId}/like`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + tokenAuth
                    },
                    body: JSON.stringify(like)
                })
                .then((res) => res.json())
                .then((data) => {
                    setCountDislike(countDislike + 1);
                    dislikeIcon[0].style.color = 'red';
                    setIsLike(0);
                })
                .catch((err) => (console.log(err)))
        }
    }


    return(
        <LikeContainer>
            {isLike === 1 ? 
                (<LikeBtn onClick={handleLike}>
                    <ThumbsIcon isGreen className="fa-solid fa-thumbs-up"/>
                    <span>{countLike}</span>
            </LikeBtn>)
            : (<LikeBtn onClick={handleLike}>
                <ThumbsIcon className="fa-solid fa-thumbs-up"/>
                <span>{countLike}</span>
            </LikeBtn>)
            }
            
            {isLike === 0 ?
            (<LikeBtn onClick={handleDislike}>
                <ThumbsIcon isRed className="fa-solid fa-thumbs-down"/>
                <span>{countDislike}</span>
            </LikeBtn>) 
            : (<LikeBtn onClick={handleDislike}>
                <ThumbsIcon className="fa-solid fa-thumbs-down"/>
                <span>{countDislike}</span>
            </LikeBtn>)
            }
        </LikeContainer>
    )
}

export default LikesDislikesBtn