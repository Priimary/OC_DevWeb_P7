import Post from '../../components/FullPost'; 
import styled from 'styled-components';
import {useEffect, useState} from 'react';
import { Loader } from '../../utils/style/Atoms'
import { Navigate, useParams} from 'react-router-dom';


const PageTitle = styled.h1`
    text-align: center;
`

const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
`
const PostsContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 30px;
    margin: auto;
    width: 1000px;
`
const LoaderWrapper = styled.div`
    display: flex;
    justify-content: center;
`

function FullPost(){
    const [isDataLoading, setDataLoading] = useState(true);
    const [post, setPost] = useState([]);
    const [error, setError] = useState(false);
    const [redirect, setRedirect] = useState(false);
    const {id} = useParams();
    const userStr = localStorage.getItem('user');
    const user = JSON.parse(userStr);

    useEffect(() => {
        async function fetchPost(token){
            try{
                const response = await fetch(`http://localhost:3000/api/posts/${id}`, {
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                });
                const post = await response.json();
                setPost(post[0]);
            }
            catch(err){
                console.log(err,'ERROR');
                setError(true);
            }
            finally{
                setDataLoading(false)
            }
        }
        setDataLoading(true);
        if(!userStr){
            setRedirect(true)
        }
        else{
            const now = new Date();
            if(now.getTime() > user.expiry){
                localStorage.removeItem('user');
                setRedirect(true);
            }
            else{
                fetchPost(user.token)
            }
        }

    }, []);
    
    if(error){
        return <span>Oups il y a un problème</span>
    }

    return(
        <PageContainer>
            {redirect ? <Navigate to="/connexion"/> :  null}
            {isDataLoading ? (
                <LoaderWrapper>
                    <Loader/>
                </LoaderWrapper>
            ) : (<>
                    <PageTitle>Post n°{post.id}</PageTitle>
                    <PostsContainer>
                            <Post
                                key={`${post.title}-${post.id}`}
                                postId={post.id}
                                postUserId={post.User_id}
                                userId={user.userId}
                                tokenAuth={user.token}
                                content={post.content}
                                imgUrl={post.imgUrl}
                                title={post.title}
                                createdAt={post.createdAt}
                                updatedAt={post.updatedAt}
                            />
                    </PostsContainer>
                </>
            )}
        </PageContainer>
    )
}


export default FullPost