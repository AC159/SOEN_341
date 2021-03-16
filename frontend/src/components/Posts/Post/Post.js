import React, { useState } from "react";
import './Post.css';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../../../AuthProvider';

function Post(props){
    const [inputBox, changeInputBox] = useState(false);
    const [comments, changeComments] = useState(props.comments);
    const [like, setLike] = useState(props.likedby);
    const [text, changeText] = useState("");
    const { currentUser, signout } = useAuth();

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
        console.log(postID)
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
                <h4>{like > 2 ? "Liked by " + like[0] + ", " + like[1] + " and many others" : like.length === 0 ? "" : "Liked by " + like.join(", ")}</h4>
                <Button variant="outlined" size="small" onClick={() => postLike(props.postID)} style={{height: 40, marginLeft:'auto'}}>Like</Button>
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
