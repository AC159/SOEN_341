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
    const [MoreItems, changeMoreItems] = useState(true)
    const { currentUser, signout } = useAuth();
    const history = useHistory();

    useEffect(() => {
        if (currentUser == null){
            history.push('/signin')
        } else {
            axios.get('/users/')
            .then((res) => {
            setPosts(res.data)
            });
        }
    }, [currentUser, history]);


    if (Posts === null)
        return <div className="loading">
            <CircularProgress size='100px'/>
        </div>

    const users = Posts === null ? Posts.map((user, index) => {
        return <Post key={index} name={user} source={source} profile={Image} likedBy={likedBy} comments={comments} />;
    }) : []
    function getMoreItems(){
        if (Posts.length > 25)
            changeMoreItems(false)
        else
            setTimeout(() =>{
                setPosts(Posts.concat(Posts))
            },2000)
    }
    return (
        <InfiniteScroll
            style={{paddingTop:'40px'}}
            dataLength={Posts.length} 
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
