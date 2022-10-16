import PropTypes from 'prop-types';
import styled from 'styled-components';
import colors from '../../utils/style/colors';


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
function Post({title, content, imgUrl, createdAt, updatedAt}){

    return(
        <PostWrapper>
            <PostTitle>{title}</PostTitle>
            <span>{content}</span>
            {imgUrl != null ? 
            (<a href={`${imgUrl}`}>
                <PostImg src={imgUrl} alt=""/>
            </a>) : null}
            <p>Post créé le : {createdAt}</p>
            {updatedAt !== createdAt ? <p>Modifié le : {updatedAt}</p> : null}
        </PostWrapper>
    )
}

Post.propTypes = {
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    imgUrl: PropTypes.string,
    createdAt: PropTypes.string.isRequired,
    updatedAt: PropTypes.string.isRequired
}

export default Post
