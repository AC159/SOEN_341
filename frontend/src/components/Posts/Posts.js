import React, {useEffect, useState} from 'react';
import Post from './Post/Post';
import axios from "axios";
import Image from '../../assets/images/anonymous.jpg'
import CircularProgress from '@material-ui/core/CircularProgress';
import '../Posts/Post/Post.css'
import InfiniteScroll from 'react-infinite-scroll-component';
import LinearProgress from '@material-ui/core/LinearProgress';
const source = 'https://i.ytimg.com/vi/nVDxiLBjMuM/maxresdefault.jpg'
const likedBy = "Bob, John, and 12 others"

function Posts(){
    const [Posts, setPosts] = useState(null)
    const [MoreItems, changeMoreItems] = useState(true)
    useEffect(() => {
        axios.get('/users')
        .then((res) => {
            setPosts(res.data.users)
            });
    }, []);

    if (Posts === null)
        return <div className="loading">
            <CircularProgress size='100px'/>
        </div>

    const users = Posts.map((user, index) => {
        return <Post key={index} name={user} source={source} profile={Image} likedBy={likedBy}/>;
    })
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
            dataLength={Posts.length} //This is important field to render the next data
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
