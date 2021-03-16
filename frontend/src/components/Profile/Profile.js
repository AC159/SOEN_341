import React, { useState, useEffect, useContext } from 'react';
import classes from './Profile.module.css'
import Avatar from '@material-ui/core/Avatar';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';
import { useAuth } from '../../AuthProvider';
import { ModalContext } from './ModalContextProvider/ModalContextProvider';
import { useHistory, useParams  } from "react-router-dom";
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from 'axios'
import Dialog from "./Followers_Following_Dialog/Dialog";

const AccountName = "DummyName"
const ProfilePictureSource = "https://cdn.mos.cms.futurecdn.net/z3rNHS9Y6PV6vbhH8w83Yn-1200-80.jpg"
const Numbers = {followers: 10, following: 17}
const comments = [
    {id: 1, person: "bob", content: "432x4cf3"},
    {id: 2, person: "bob", content: "2213214"},
    {id: 3, person: "bob", content: "4324aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa523"},
]
const Display = [
    {id: 1, img: 'https://cdn.mos.cms.futurecdn.net/z3rNHS9Y6PV6vbhH8w83Yn-1200-80.jpg', title: 'whatever', cols: 1, likedBy: "Bob, John, and 12 others", comments: comments},
    {id: 2, img: 'https://cdn.mos.cms.futurecdn.net/z3rNHS9Y6PV6vbhH8w83Yn-1200-80.jpg', title: 'whatever', cols: 1, likedBy: "Bob, John, and 12 others", comments: comments},
    {id: 3, img: 'https://cdn.mos.cms.futurecdn.net/z3rNHS9Y6PV6vbhH8w83Yn-1200-80.jpg', title: 'whatever', cols: 1, likedBy: "Bob, John, and 12 others", comments: comments},
    {id: 9, img: 'https://cdn.mos.cms.futurecdn.net/z3rNHS9Y6PV6vbhH8w83Yn-1200-80.jpg', title: 'whatever', cols: 1, likedBy: "Bob, John, and 12 others", comments: comments},
    {id: 10, img: 'https://media.wired.com/photos/598e35fb99d76447c4eb1f28/master/pass/phonepicutres-TA.jpg', title: 'whatever', cols: 2, likedBy: "Bob, John, and 12 others", comments: comments}
]

function Profile(props){
    const [picture, setPicture] = useState(null)
    const [name, setName] = useState(null)
    const [folllowersFollowing, changeFollowersFollowing] = useState(null);
    const [includesID, setIncludesID] = useState(false);
    const [pictures, changePictures] = useState(null)
    const [open, setOpen] = useState(false)
    const [attributes, setAttributes] = useState("")
    const [inputBox, changeInputBox] = useState(false)
    const [comments, changeComments] = useState("")
    const [text, changeText] = useState("")
    const { currentUser, signout } = useAuth();
    const history = useHistory();
    const params = useParams();
    const { openFollowersModal, openFollowingModal, openFollowersDialog, openFollowingDialog } = useContext(ModalContext);

    useEffect(() => {
        // Verify if the current user is already following the other user and change state accordingly

        if (folllowersFollowing !== null) {
            setIncludesID(folllowersFollowing.followers.some(user => user._id === currentUser.uid));
        }

    }, [folllowersFollowing, changeFollowersFollowing, setIncludesID, includesID]);

    useEffect(() => {
        if (currentUser === null){
            history.push('/signin')
        } else if (currentUser === undefined){

        } else {
            axios.get('/users/' + params.id)
            .then(function (response) {
                console.log('changeFollowersFollowing', response);
                setName(response.data.name);
                changeFollowersFollowing({"followers": response.data.followers, "following": response.data.following})
                setPicture(response.data.avatar);
            })
            .catch(function (error) {
            console.log(error);
            })
            axios.get(`/posts/${params.id}`).then((res) => {
                const { data } = res;
                changePictures(data)
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
        temp.push({id: comments.length + 1, person: {name}, content: text})
        changeComments(temp)
        changeText("")
        axios.post('/users/comment', {
            comment: text,
            imageUrl: attributes.getNamedItem("src").value,
            name: currentUser.uid,
            ImageOwnerName: params.id,
          })
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          });
    }

    function TryFollow() {
        // Here the current user is looking at another user's profile page

        if (includesID){
            axios.post('/users/unfollow', {
                uid: currentUser.uid,
                following_uid: params.id,
              })
              .then(function (response) {
                console.log('unfollow', response);
                changeFollowersFollowing({"followers": response.data.followedUser.followers, "following": response.data.followedUser.following});
              })
              .catch(function (error) {
                console.log(error);
              });
        } else {
            axios.post('/users/follow', {
                uid: currentUser.uid,
                following_uid: params.id,
              })
              .then(function (response) {
                console.log('follow', response);
                changeFollowersFollowing({"followers": response.data.followedUser.followers, "following": response.data.followedUser.following})
              })
              .catch(function (error) {
                console.log(error);
              });
        }

        console.log('openFollowersModal', openFollowersModal);
        console.log('openFollowingModal', openFollowingModal);
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
                        <td>
                            <span className={classes.ProfileStats} onClick={() => openFollowersDialog(true)} style={{ cursor: 'pointer' }}>
                                Followers: {folllowersFollowing.followers.length}
                            </span>
                        </td>
                        <td>
                            <span className={classes.ProfileStats} onClick={() => openFollowingDialog(true)} style={{ cursor: 'pointer' }}>
                                Following: {folllowersFollowing.following.length}
                            </span>
                        </td>
                    </tr>
                    </tbody>
                </table>
                {
                    currentUser.uid === params.id ? <div/>:
                        includesID ? <div><Button variant="outlined" onClick={TryFollow}>Unfollow</Button></div> :
                        <div> <Button variant="outlined" onClick={TryFollow}>Follow</Button></div>
                }
            </div>
            <GridList cellHeight={250} style={{width: "100%"}} cols={3}>
                {pictures.map((tile) => (<GridListTile key={tile._id} cols={tile.cols || 1} rows={tile.rows || 1} onClick={(event) => {
                    console.log(event.target.attributes)
                    setAttributes(event.target.attributes)}}>
                                            <img src={tile.imageUrl} alt={tile.caption} likedBy={tile.likes} comments={JSON.stringify(tile.comments)}/>
                                        </GridListTile>))}
            </GridList>

            {openFollowersModal ? <Dialog type={"followers"} data={folllowersFollowing.followers} /> : null}

            {openFollowingModal ? <Dialog type={"following"} data={folllowersFollowing.following} /> : null}

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