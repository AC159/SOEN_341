import React, { Component } from "react";
import './Post.css';
import Image from '../../../assets/images/anonymous.jpg';

class Post extends Component {

    render() {
        return <article className="Post">
            <header>
                <div className="Post-user">
                    <div className="Post-user-avatar">
                        <img src={Image} alt="Anonymous"/>
                    </div>
                    <div className="Post-user-nickname">
                        <span>{this.props.name}</span>
                    </div>
                </div>
            </header>
            <div className="Post-image">
                <div className="Post-image-bg">
                    <img src={Image} alt="Anonymous"/>
                </div>
            </div>
            <div className="Post-caption">
                <strong>Comments</strong>
                <button className="comment-button">Leave a comment</button>
            </div>
        </article>;
    }
}
export default Post;
