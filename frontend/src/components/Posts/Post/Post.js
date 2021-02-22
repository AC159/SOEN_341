import React, { useState } from "react";
import './Post.css';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

function Post(props){
    const [inputBox, changeInputBox] = useState(false)

        return <article className="Post">
            {props.modal ? null: <header>
                <div className="Post-user">
                    <div className="Post-user-avatar">
                        <img src={props.profile} alt="Anonymous"/>
                    </div>
                    <div className="Post-user-nickname">
                        <span>{props.name}</span>
                    </div>
                </div>
            </header>}
            <div className="Post-image">
                <div className="Post-image-bg">
                    <img src={props.source} alt="Anonymous"/>
                </div>
            </div>
            <div className="Post-caption">
                <h4>Liked by {props.likedBy}</h4>
                <Button variant="outlined" size="small"  style={{height: 40, marginLeft:'auto'}}>Like</Button>
                <Button variant="outlined" size="small"  onClick={() => changeInputBox(!inputBox)} style={{height: 40}}>Leave a comment</Button>
            </div>
            {inputBox ? <div className="Post-comment">
                <TextField id="outlined-basic" label="Comment..." variant="outlined" style={{width: "85%"}} />
                <Button variant="outlined" onClick={() => console.log("posted")} style={{width: "15%"}} >Post</Button>
            </div>: null}
        </article>;
}
export default Post;
