import {useState} from 'react';
import styled from 'styled-components';



function LikesDislikes({postId, tokenAuth, likes, dislikes, userLike}){
    const [isLike, setIsLike] = useState(userLike);
    const [countDislike, setCountDislike] = useState(dislikes);
    const [countLike, setCountLike] = useState(likes);
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
                setCountDislike(countDislike - 1);
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
                setCountLike(countLike - 1);
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
                    setIsLike(0);
                })
                .catch((err) => (console.log(err)))
        }
    }


    return(
        <>
            <button onClick={handleLike}>{countLike}</button>
            <button onClick={handleDislike}>{countDislike}</button>
        </>
    )
}

export default LikesDislikes