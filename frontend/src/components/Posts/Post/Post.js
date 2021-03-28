import React, { useState } from "react";
import './Post.css';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import BootstrapTooltips from './BootstrapTooltip';
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../../../AuthProvider';

function Post(props){
    const [inputBox, changeInputBox] = useState(false);
    const [comments, changeComments] = useState(props.comments);
    const [like, setLike] = useState(props.likedby);
    const [text, changeText] = useState("");
    const { currentUser } = useAuth();

    function postComment(){
        let temp = comments
        temp.push({id: comments.length + 1, person: props.user, content: text})
        changeComments(temp)
        changeText("")
        axios.post('/posts/comment', {
            comment: text,
            imageUrl: props.source,
            uid: currentUser.uid,
            name: currentUser.name,
            ImageOwnerName: props.owner
          })
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          });
    }

    const postLike = (postID) => {
        axios.post('/posts/like', {
            uid: currentUser.uid,
            name: currentUser.name,
            postID: postID
        }).then((response) => {
            console.log(response.data);
            if (!like.includes(currentUser.name))
                setLike(like.concat(currentUser.name));
        }).catch((error) => {
            console.log(error);
        });
    }

    const postUnlike = (postID) => {
        axios.post('/posts/unlike', {
            uid: currentUser.uid,
            name: currentUser.name,
            postID: postID
        }).then((response) => {

            if (!like.includes(currentUser.name)) {
                setLike(like.concat(currentUser.name));
            }

            // Remove the current user name from the list of "likes" for this post since he just unliked
            setLike(like.filter(name => {
                return name !== currentUser.name;
            }));

        }).catch((error) => {
            console.log(error);
        });
    }

        return <article className="Post">
            {props.modal ? null: <header>
                <div className="Post-user">
                    <div className="Post-user-avatar">
                        <Link to={"/profile/" + props.owner}> <img src={props.profile} alt="Anonymous"/></Link>
                    </div>
                    <div className="Post-user-nickname">
                        <Link to={"/profile/" + props.owner}><p style={{textDecoration:'none', color:'black'}}>{props.name}</p></Link>
                    </div>
                </div>
            </header>}
            <div className="Post-image">
                <div className="Post-image-bg">
                    <img src={props.source} alt="Anonymous"/>
                </div>
            </div>
            <h3 className="Post-caption">{props.caption}</h3>
            <div className="Post-like">
                <BootstrapTooltips title={like.join(",\n")}>
                    <h4>{like.length + " like(s)"}</h4>
                </BootstrapTooltips>
                { like.includes(currentUser.name) ? <Button variant="outlined"
                        size="small" onClick={() => postUnlike(props.postID)}
                        style={{height: 40, marginLeft:'auto'}}>Unlike</Button> : <Button variant="outlined"
                                                                                          size="small"
                                                                                          onClick={() => postLike(props.postID)}
                                                                                          style={{height: 40, marginLeft:'auto'}}>Like</Button>
                }
                <Button variant="outlined" size="small"  onClick={() => changeInputBox(!inputBox)} style={{height: 40}}>Leave a comment</Button>
            </div>
            {inputBox ? <div className = "Post-Comments">
                {comments.map((item, index) => {
                    if (comments.length - index < 6)
                        return(
                            <p className="Post-comments"><b>{item.person}</b>{item.content}</p>
                        )
                    else {}
                })}
                <div className="Post-comment">
                    <TextField id="outlined-basic" label="Comment..." variant="outlined" style={{width: "85%"}} value={text} onChange={(event) => changeText(event.target.value)}/>
                    <Button disabled={text === ""} variant="outlined" onClick={postComment} style={{width: "15%"}} >Post</Button>
                </div>
            </div>: null}
        </article>;
}
export default Post;
