import Post from '../../components/Post'; 
import styled from 'styled-components';
import {useEffect, useState} from 'react';
import { Loader } from '../../utils/style/Atoms'

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

function Posts(){
    const [isDataLoading, setDataLoading] = useState(false);
    const [postsList, setPostsList] = useState([]);
    const [error, setError] = useState(false);

    useEffect(() => {
        async function fetchPosts(){
            setDataLoading(true);
            try{
                const response = await fetch(`http://localhost:3000/api/posts`);
                const postsList = await response.json();
                setPostsList(postsList);
            }
            catch(err){
                console.log(err,'ERROR');
                setError(true);
            }
            finally{
                setDataLoading(false);
            }
        }
        fetchPosts()
    }, []);
    
    if(error){
        return <span>Oups il y a un problème</span>
    }

    return(
        <PageContainer>
            <PageTitle>Liste des posts</PageTitle>
            {isDataLoading ? (
                <LoaderWrapper>
                    <Loader/>
                </LoaderWrapper>
            ) : (
                <PostsContainer>
                {postsList.map((post, index) => (
                    <Post
                        key={`${post.title}-${post.id}`}
                        content={post.content}
                        imgUrl={post.imgUrl}
                        title={post.title}
                        createdAt={post.createdAt}
                        updatedAt={post.updatedAt}
                    />
                ))}
                </PostsContainer>
            )}
        </PageContainer>
    )
}

export default Posts
