import Post from '../../components/Post';
import styled from 'styled-components';
import NewPostBtn from '../../components/NewPostBtn'
import {useEffect, useState} from 'react';
import {Loader} from '../../utils/style/Atoms'
import {Navigate} from 'react-router-dom';

const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-bottom: 50px;
`

const PostsContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin: auto;
    gap: 40px;
    width: 70%;

    @media all and (max-width: 768px){
        width: 80%;
    }
`

const LoaderWrapper = styled.div`
    display: flex;
    justify-content: center;
`


function Home(){
    const [isDataLoading, setDataLoading] = useState(true);
    const [postsList, setPostsList] = useState([]);
    const [error, setError] = useState(false);
    const [redirect, setRedirect] = useState(false);
    const user = JSON.parse(localStorage.getItem('user'));

    // vérifie si l'utilisateur est connecté en regardant dans le localstorage/store redux
    // si pas connecté, redirige vers la page de connexion
    // sinon recupère la liste des posts depuis l'api
    useEffect(() => {
        async function fetchPosts(token){
            try{
                const response = await fetch(`http://localhost:3000/api/posts`, {
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                });
                const postsList = await response.json();
                setPostsList(postsList);
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
        const userStr = localStorage.getItem('user');
        if(!userStr){
            setRedirect(true)
        }
        else{
            const user = JSON.parse(userStr);
            const now = new Date();
            if(now.getTime() > user.expiry){
                localStorage.removeItem('user');
                setRedirect(true);
            }
            else{
                fetchPosts(user.token);
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
                    <h1>Liste des posts</h1>
                    <NewPostBtn tokenAuth={user.token}/>
                    <PostsContainer>
                        {postsList.map((post, index) => (
                            <Post
                                key={`${post.title}-${post.id}`}
                                postId={post.id}
                                content={post.content}
                                imgUrl={post.imgUrl}
                                title={post.title}
                                createdAt={post.createdAt}
                                updatedAt={post.updatedAt}
                            />
                        ))}
                    </PostsContainer>
                </>
            )}
        </PageContainer>
    )
}


export default Home
