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

const source = 'https://i.ytimg.com/vi/nVDxiLBjMuM/maxresdefault.jpg'
const likedBy = "Bob, John, and 12 others"
const comments = [
    {id: 1, person: "bob", content: "432x4cf3"},
    {id: 2, person: "bob", content: "2213214"},
    {id: 3, person: "bob", content: "4324523"},
    {id: 4, person: "bob", content: "r32r3sx"},
    {id: 5, person: "bob", content: "21d324f532"},
    {id: 6, person: "bob", content: "3s1254v32"},
]

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
        return <Post key={post._id} id={post._id} name={post.name || "Placeholder"} caption={post.caption} source={post.imageUrl} profile={Image} likedby={post.likes} comments={post.comments} user={currentUser.name} owner={post.owner}/>;
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
