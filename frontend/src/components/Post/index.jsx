import styled from 'styled-components';
import colors from '../../utils/style/colors';
import { Link } from 'react-router-dom';

const PostWrapper = styled(Link)`
    display: flex;
    flex-direction: column;
    border: 1px solid ${colors.tertiary};
    box-shadow:  0px 5px 15px 0px ${colors.tertiary};
    border-radius: 30px;
    background-color: ${colors.backgroundColor};
    color: ${colors.tertiary};
    font-size: 18px;
    text-decoration: none;
    transition: 200ms;
    &:hover{
        cursor: pointer;
        box-shadow: 2px 2px 10px ${colors.secondary};
    }
`

const PostTitle = styled.h2`
    white-space: pre-wrap;
    word-break: break-word;
    color: ${colors.tertiary};
    text-transform: uppercase;
    font-size: 26px;
    font-weight: bold;
    margin: 0 0 10px 0;
    padding: 10px 10px 0 10px;
    border-bottom: 5px solid ${colors.primary};
`

const PostContent = styled.pre`
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    white-space: pre-wrap;
    word-break: break-word;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 0 30px;
    margin: 0;

    @media all and (max-width: 768px){
        -webkit-line-clamp: 3;
    }
`

const PostImg = styled.img`
    border: 1px solid ${colors.tertiary};
    border-radius: 10px;
    box-shadow: 0 1px 1px 1px ${colors.tertiary};
    width: 300px;
    padding: 2px;
    margin-top: 10px;
    align-self: center;

    @media all and (max-width: 768px){
        width: 200px;
    }
`

const PostDate = styled.p`
    font-size: 14px;
    border-top: 5px solid ${colors.primary};
    margin: 10px 0 0 0;
    padding: 5px 15px;
`

function Post({postId, title, content, imgUrl, createdAt, updatedAt}){
    return(
        <PostWrapper to={"/post/" + postId}>
            <PostTitle>{title}</PostTitle>
            <PostContent>{content}</PostContent>
            {imgUrl != null ? <PostImg src={imgUrl} alt=""/> : null}
            {updatedAt === createdAt ? <PostDate>Créé le : {createdAt}</PostDate> : <PostDate>Créé le : {createdAt}, modifié le : {updatedAt}</PostDate>}
        </PostWrapper>
    )
}

export default Post
