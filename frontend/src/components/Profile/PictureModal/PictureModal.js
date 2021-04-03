import React, { useState, useEffect } from 'react'
import classes from './PictureModal.module.css'
import BootstrapTooltips from '../../Posts/Post/BootstrapTooltip'
import { useAuth } from '../../../AuthProvider';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import axios from 'axios'
import { useHistory, useParams } from "react-router-dom";

function PictureModal(props){
    const { currentUser } = useAuth();
    const params = useParams();

    const [text, changeText] = useState("")
    const [comments, changeComments] = useState(props.comments)
    const [likedBy, changeLikedBy] = useState(props.likedBy)

    //self-explanatory functions to like,unlike,comment on pictures from the modal
    //the states are changed to trigger rerenders of the popup and its props with functions called in the parent component when one closes/opens back the modal
    function postComment() {
        if (text === "")
            return;
        let temp = comments;
        props.commentFunction(props.index, text)
        temp.push({ id: temp.length + 1, person: currentUser.name, content: text })
        changeComments(temp)
        changeText("")
        axios.post('/posts/comment', {
            comment: text,
            imageUrl: props.source,
            uid: currentUser.uid,
            name: currentUser.name,
            ImageOwnerName: params.id,
        }).then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.log(error);
            });
    }
    
    const postLike = () => {
        axios.post('/posts/like', {
            uid: currentUser.uid,
            name: currentUser.name,
            postID: props.postID
        }).then((response) => {
            changeLikedBy(likedBy.concat(currentUser.name))
            props.likeFunction(props.index)
        }).catch((error) => {
            console.log(error)
        });
    }

    const postUnlike = () => {
        axios.post('/posts/unlike', {
            uid: currentUser.uid,
            name: currentUser.name,
            postID: props.postID
        }).then((response) => {
            // Remove the current user name from the list of "likes" for this post since he just unliked
            changeLikedBy(likedBy.filter(name => name !== currentUser.name));
            props.likeFunction(props.index)
        }).catch((error) => {
            console.log(error);
        });
    }

    return (
        <div className={classes.PictureModal_popup}>
        <div>
            <div className={classes.PictureModal_picture}>
                <img src={props.source} alt={props.caption} style={{ maxHeight: '50vh', maxWidth: "60vw" }} />
            </div>
            <h3 style={{ marginTop: '5px', marginBottom: '-10px' }}>{props.caption}</h3>
            <div className={classes.PictureModal_caption}>

                <BootstrapTooltips title={likedBy.join(', ')}>
                    <h4>{likedBy.length + " like(s)"}</h4>
                </BootstrapTooltips>

                {likedBy.includes(currentUser.name) ? <Button variant="outlined"
                        size="small" onClick={() => postUnlike(props.postID)}
                        style={{height: 40, marginLeft:'auto'}}>Unlike</Button> : <Button variant="outlined"
                          size="small"
                          onClick={() => postLike(props.postID)}
                          style={{height: 40, marginLeft:'auto'}}>Like</Button>
                }
            </div>
        </div>
        <div className={classes.PictureModal_comments}>
            <div className={classes.PictureModal_commentsScroll}>
                {comments.map((item,index) => {
                    return (<p key={index} className={classes.PictureModal_comment}><b>{item.person}</b>{item.content}</p>)
                })}
            </div>
            <div className={classes.PictureModal_commentBox}>
                <TextField id="outlined-basic" label="Comment..." variant="outlined" style={{ marginLeft: "10px", width: '80%' }} value={text} onChange={(event) => changeText(event.target.value)} />
                <Button variant="outlined" onClick={postComment} style={{ height: 56 }} >Post</Button>
            </div>
        </div>
    </div>
    )
}

export default PictureModal