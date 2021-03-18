import React, {useEffect, useState} from 'react';
import Post from './Post/Post';
import axios from "axios";
import Image from '../../assets/images/anonymous.jpg'
import CircularProgress from '@material-ui/core/CircularProgress';
import '../Posts/Post/Post.css'
import InfiniteScroll from 'react-infinite-scroll-component';
import LinearProgress from '@material-ui/core/LinearProgress';
import { useAuth } from '../../AuthProvider';
import { useHistory } from "react-router-dom";


function Posts(){
    const [Posts, setPosts] = useState(null)
    const [hiddenPosts, changeHiddenPosts] = useState(null);
    const [MoreItems, changeMoreItems] = useState(true)
    const { currentUser, signout } = useAuth();
    const history = useHistory();

    useEffect(() => {
        if (currentUser === null){
            history.push('/signin')
        } else if(currentUser === undefined){
            
        }
        else {
            axios.get('/posts')
            .then((res) => {
                if (res.data.length < 10){
                    setPosts(res.data)
                } else{
                    changeHiddenPosts(res.data)
                    setPosts(res.data.slice(0, 10))
                }
            });
        }
    }, [currentUser, history]);

    useEffect(() => {
        if (Posts === null || hiddenPosts === null) {
            return;
        }
         else if (hiddenPosts === null || hiddenPosts.length === Posts.length)
            setTimeout(() => {
                changeMoreItems(false)
            } ,1000)
    }, [Posts, hiddenPosts])

    if (Posts === null && hiddenPosts === null)
        return <div className="loading">
            <CircularProgress size='100px'/>
        </div>

    const users = Posts !== null ? Posts.map((post, index) => {
        return <Post key={post._id} name={post.owner.name} caption={post.caption} source={post.imageUrl} profile={post.owner.avatar || Image} likedby={post.likes} comments={post.comments} user={currentUser.name} owner={post.owner._id} postID = {post._id}/>;
    }) : []
    function getMoreItems(){
        if (hiddenPosts === null || hiddenPosts.length === Posts.length)
            changeMoreItems(false)
        else
            setPosts(hiddenPosts.slice(0, Posts.length + 10))
    }
    
    return (
        <InfiniteScroll
            style={{paddingTop:'40px'}}
            dataLength={hiddenPosts === null ? Posts.length: hiddenPosts.length} 
            next={getMoreItems}
            hasMore={MoreItems}
            loader={<LinearProgress style={{ textAlign: 'center', marginBottom: '25px', marginLeft: '100px', marginRight: '100px' }}/>}
            endMessage={
                <p style={{ textAlign: 'center' }}>
                    <b>You are up to date</b>
                </p>}>
            {users}
        </InfiniteScroll>

       );

}

export default Posts;
