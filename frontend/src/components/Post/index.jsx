import PropTypes from 'prop-types';
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
    color: ${colors.tertiary};
    text-transform: uppercase;
    font-size: 24px;
    font-weight: bold;
    margin: 0;
    padding: 10px 10px 0 10px;
    border-bottom: 5px solid ${colors.primary};
`

const PostContent = styled.p`
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin: 0;
    padding: 10px;
`

const PostImg = styled.img`

    border: 1px solid ${colors.tertiary};
    border-radius: 10px;
    box-shadow: 0 1px 1px 1px ${colors.tertiary};
    width: 25%;
    padding: 2px;
    margin-bottom: 10px;
    align-self: center;
`

const PostDate = styled.span`
    border-top: 5px solid ${colors.primary};
    margin: 0;
    padding: 10px;
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

Post.propTypes = {
    postId: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    imgUrl: PropTypes.string,
    createdAt: PropTypes.string.isRequired,
    updatedAt: PropTypes.string.isRequired
}

export default Post
