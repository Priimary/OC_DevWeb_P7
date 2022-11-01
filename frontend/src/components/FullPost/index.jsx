import PropTypes from 'prop-types';
import styled from 'styled-components';
import colors from '../../utils/style/colors';
import ModifyPostBtn from '../ModifyPostBtn'
import DeletePostBtn from '../DeletePostBtn'
import LikesDislikesBtn from '../LikesDislikesBtn';

const PostWrapper = styled.div`
    display: flex;
    color: ${colors.tertiary};
    background-color: ${colors.backgroundColor};
    border: 2px solid ${colors.tertiary};
    border-radius: 30px;
    box-shadow: 0 1px 20px 5px ${colors.tertiary};
    font-size: 18px;
    font-weight: bold;

    @media all and (max-width: 768px){
        flex-direction: column;
    }
`

const ContentContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 80%;

    @media all and (max-width: 768px){
        width: 100%;
    }
`

const ButtonsContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    width: 20%;
    padding: 15px 0;
    border-left: 5px solid ${colors.primary};
    box-shadow: -5px 0 ${colors.tertiary};

    @media all and (max-width: 768px){
        border-left: none;
        box-shadow: none;
        width: 100%;
    }
`

const PostTitle = styled.h2`
    white-space: pre-wrap;
    word-break: break-word;
    color: ${colors.tertiary};
    text-transform: uppercase;
    font-size: 36px;
    font-weight: bold;
    margin: 0;
    padding: 10px 10px 0 10px;
    border-bottom: 5px solid ${colors.primary};
    box-shadow: 0 5px ${colors.tertiary};

    @media all and (max-width: 768px){
        font-size: 30px;
    }
`

const PostContent = styled.pre`
    white-space: pre-wrap;
    word-break: break-word;
    font-weight: normal;
    margin: 0;
    padding: 10px 30px;
`

const PostImg = styled.img`
    border: 1px solid ${colors.tertiary};
    border-radius: 10px;
    box-shadow: 0 1px 1px 1px ${colors.tertiary};
    width: 90%;
    padding: 2px;
    margin-bottom: 15px;
    align-self: center;
`

const PostDate = styled.p`
    font-size: 14px;
    font-weight: normal;
    border-top: 5px solid ${colors.primary};
    box-shadow: 0 -5px ${colors.tertiary};
    margin: 0;
    padding: 3px 15px;
`

function FullPost({postId, postUserId, userId, userRoleId, tokenAuth, title, content, imgUrl, createdAt, updatedAt, likes, dislikes, userLike, postUpdated, setPostUpdated}){
    return(
        <>
            <PostWrapper>
                <ContentContainer>
                    <PostTitle>{title}</PostTitle>

                    <PostContent>{content}</PostContent>

                    {imgUrl != null ? (<PostImg src={imgUrl} alt=""/>) : null}

                    {updatedAt === createdAt ?
                        (<PostDate>Créé le : {createdAt}</PostDate>)
                    :
                        (<PostDate>Créé le : {createdAt}, modifié le : {updatedAt}</PostDate>)
                    }
                </ContentContainer>

                <ButtonsContainer>
                    <LikesDislikesBtn 
                        postId={postId} 
                        tokenAuth={tokenAuth} 
                        likes={likes} 
                        dislikes={dislikes} 
                        userLike={userLike}/>
                    
                    {postUserId === userId || userRoleId === 1 ?
                        (<>
                            <ModifyPostBtn
                                postId={postId}
                                tokenAuth={tokenAuth}
                                content={content}
                                title={title}
                                postUpdated={postUpdated}
                                setPostUpdated={setPostUpdated}/>
                            <DeletePostBtn
                                postId={postId} 
                                tokenAuth={tokenAuth}/>
                        </>)
                    : null}
                </ButtonsContainer>
            </PostWrapper>
        </>
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
