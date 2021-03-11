import React, { useState, useEffect } from 'react';
import classes from './Profile.module.css'
import Avatar from '@material-ui/core/Avatar';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';
import { useAuth } from '../../AuthProvider';
import { useHistory, useParams  } from "react-router-dom";
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from 'axios'

const AccountName = "DummyName"
const ProfilePictureSource = "https://cdn.mos.cms.futurecdn.net/z3rNHS9Y6PV6vbhH8w83Yn-1200-80.jpg"
const Numbers = {followers: 10, following: 17}
const comments = [
    {id: 1, person: "bob", content: "432x4cf3"},
    {id: 2, person: "bob", content: "2213214"},
    {id: 3, person: "bob", content: "4324aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa523"},
    {id: 4, person: "bob", content: "r32r3sx"},
    {id: 5, person: "bob", content: "21d324f532"},
    {id: 6, person: "bob", content: "3s1254v32"},
    {id: 6, person: "bob", content: "3s1254v32"},
    {id: 6, person: "bob", content: "3s1254v32"},
    {id: 6, person: "bob", content: "3s1254v32"},
    {id: 6, person: "bob", content: "3s1254v32"},
    {id: 6, person: "bob", content: "3s1254v32"},
    {id: 6, person: "bob", content: "3s1254v32"},
    {id: 6, person: "bob", content: "3s1254v32"},
    {id: 6, person: "bob", content: "3s1254v32"},
    {id: 6, person: "bob", content: "3s1254v32"},
    {id: 6, person: "bob", content: "3s1254v32"},
    {id: 6, person: "bob", content: "3s1254v32"},
    {id: 6, person: "bob", content: "3s1254v32"},
    {id: 6, person: "bob", content: "3s1254v32"},
    {id: 6, person: "bob", content: "3s1254v32"},
    {id: 6, person: "bob", content: "3s1254v32"},
    {id: 6, person: "bob", content: "3s1254v32"},
    {id: 6, person: "bob", content: "3s1254v32"},
    {id: 6, person: "bob", content: "3s1254v32"},
    {id: 6, person: "bob", content: "1"},
    {id: 6, person: "bob", content: "3s1254v32"},
    {id: 6, person: "bob", content: "3s1254v32"},
    {id: 6, person: "bob", content: "3s1254v32"},
    {id: 6, person: "bob", content: "3s1254v32"},
    {id: 6, person: "bob", content: "3s1254v32"},
    {id: 6, person: "bob", content: "3s1254v32"},
    {id: 6, person: "bob", content: "3s1254v32"},
    {id: 6, person: "bob", content: "3s1254v32"},
    {id: 6, person: "bob", content: "3s1254v32"},
    {id: 6, person: "bob", content: "3s1254v32"},
    {id: 6, person: "bob", content: "3s1254v32"},


]
const Display = [
    {id: 1, img: 'https://cdn.mos.cms.futurecdn.net/z3rNHS9Y6PV6vbhH8w83Yn-1200-80.jpg', title: 'whatever', cols: 1, likedBy: "Bob, John, and 12 others", comments: comments},
    {id: 2, img: 'https://cdn.mos.cms.futurecdn.net/z3rNHS9Y6PV6vbhH8w83Yn-1200-80.jpg', title: 'whatever', cols: 1, likedBy: "Bob, John, and 12 others", comments: comments},
    {id: 3, img: 'https://cdn.mos.cms.futurecdn.net/z3rNHS9Y6PV6vbhH8w83Yn-1200-80.jpg', title: 'whatever', cols: 1, likedBy: "Bob, John, and 12 others", comments: comments},
    {id: 4, img: 'https://cdn.mos.cms.futurecdn.net/z3rNHS9Y6PV6vbhH8w83Yn-1200-80.jpg', title: 'whatever', cols: 2, likedBy: "Bob, John, and 12 others", comments: comments},
    {id: 5, img: 'https://cdn.mos.cms.futurecdn.net/z3rNHS9Y6PV6vbhH8w83Yn-1200-80.jpg', title: 'whatever', cols: 1, likedBy: "Bob, John, and 12 others", comments: comments},
    {id: 6, img: 'https://cdn.mos.cms.futurecdn.net/z3rNHS9Y6PV6vbhH8w83Yn-1200-80.jpg', title: 'whatever', cols: 1, likedBy: "Bob, John, and 12 others", comments: comments},
    {id: 7, img: 'https://cdn.mos.cms.futurecdn.net/z3rNHS9Y6PV6vbhH8w83Yn-1200-80.jpg', title: 'whatever', cols: 1, likedBy: "Bob, John, and 12 others", comments: comments},
    {id: 8, img: 'https://cdn.mos.cms.futurecdn.net/z3rNHS9Y6PV6vbhH8w83Yn-1200-80.jpg', title: 'whatever', cols: 1, likedBy: "Bob, John, and 12 others", comments: comments},
    {id: 9, img: 'https://cdn.mos.cms.futurecdn.net/z3rNHS9Y6PV6vbhH8w83Yn-1200-80.jpg', title: 'whatever', cols: 1, likedBy: "Bob, John, and 12 others", comments: comments},
    {id: 10, img: 'https://media.wired.com/photos/598e35fb99d76447c4eb1f28/master/pass/phonepicutres-TA.jpg', title: 'whatever', cols: 2, likedBy: "Bob, John, and 12 others", comments: comments}
]

function Profile(props){
    const [picture, setPicture] = useState(null)
    const [name, setName] = useState(null)
    const [folllowersFollowing, changeFollowersFollowing] = useState(null);
    const [pictures, changePictures] = useState(null)
    const [open, setOpen] = useState(false)
    const [attributes, setAttributes] = useState("")
    const [inputBox, changeInputBox] = useState(false)
    const [comments, changeComments] = useState("")
    const [text, changeText] = useState("")
    const { currentUser, signout } = useAuth();
    const history = useHistory();
    const params = useParams();

    useEffect(() => {
        if (currentUser === null){
            history.push('/signin')
        } else if (currentUser === undefined){

        } else {
            axios.get('/users/' + params.id)
            .then(function (response) {
                setName(response.data.name);
                changeFollowersFollowing({"followers": response.data.followers.length, "following": response.data.following.length})
                changePictures(response.data.images)
                setPicture(response.data.avatar);
            })
            .catch(function (error) {
            console.log(error);
            })
        }
    }, [currentUser, history, params.id])

    useEffect(() => {
        if (attributes === "");
        else {
            setOpen(true);
            changeComments(JSON.parse(attributes.getNamedItem("comments").value));
        } 
    }, [attributes])

    function postComment(){
        let temp = comments
        temp.push({id: comments[comments.length - 1].id + 1, person: {name}, content: text})
        changeComments(temp)
        changeText("")
    }

    function TryFollow(){
        
    }

    if (picture === null || name === null || folllowersFollowing == null || pictures == null)
        return (<div className={classes.loading}>
                <CircularProgress size='100px'/>
            </div>)

    return(
        <div className={classes.ProfileContainer}>
            <div className={classes.ProfileTop}>
                <Avatar alt={name} src={picture} style={{ height: '150px', width: '150px'}} />
                <table className={classes.ProfileStats}>
                    <tbody>
                    <tr>
                        <td colSpan="2">
                            <h1 className={classes.ProfileName}>{name}</h1>
                        </td>
                    </tr>
                    <tr>
                        <td><p className={classes.ProfileStats}>Followers: {folllowersFollowing.followers}</p></td>
                        <td><p className={classes.ProfileStats}>Followers: {folllowersFollowing.following}</p></td>
                    </tr>
                    </tbody>
                </table>
                <div> <Button variant="outlined" onClick={TryFollow}>Follow</Button></div>
            </div>
            <GridList cellHeight={250} style={{width: "100%"}} cols={3}>
                {pictures.map((tile) => (<GridListTile key={tile.id} cols={tile.cols || 1} rows={tile.rows || 1} onClick={(event) => setAttributes(event.target.attributes)}>
                                            <img src={tile.img} alt={tile.title} likedBy={tile.likedBy} comments={JSON.stringify(tile.comments)}/>
                                        </GridListTile>))}
            </GridList>
            <Modal open={open} onClose={() => {
                setOpen(false)
                setAttributes("")
                changeComments(null)
                changeInputBox(false)
                }}>
                    {attributes === "" ? null:
                    <div className={classes.Popup}>
                        <div>
                            <div className={classes.PopupPicture}>
                                <img src={attributes.getNamedItem("src").value} alt={attributes.getNamedItem("alt").value} style={{maxHeight:'75vh', maxWidth:"80vw"}}/>
                            </div>
                            <div className={classes.ProfileCaption}>
                                <h4>Liked by {attributes.getNamedItem("likedBy").value}</h4>
                                <Button variant="outlined" size="small"  style={{height: 40, marginLeft:'auto'}}>Like</Button>
                                <Button variant="outlined" size="small"  onClick={() => changeInputBox(!inputBox)} style={{height: 40}}>Leave a comment</Button>
                            </div>
                        </div>
                        {inputBox ? <div className={classes.ProfileComment}>
                            <div className={classes.ProfileCommentScroll}>
                                {comments.map(item => {
                                    return(<p className="Post-comments"><b>{item.person}</b>{item.content}</p>)
                                })}
                            </div>
                            <div style={{marginTop: '10px'}}>
                                <TextField id="outlined-basic" label="Comment..." variant="outlined" style={{marginLeft: "10px", width: '80%'}} value={text} onChange ={(event) => changeText(event.target.value)}/>
                                <Button variant="outlined" onClick={postComment} style={{ height:56}} >Post</Button>
                            </div>
                        </div>: null}
                    </div>}
                
            </Modal>
        </div>
    )
}

export default Profile;