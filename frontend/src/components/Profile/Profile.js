import React, { useState, useEffect, useContext } from 'react';
import classes from './Profile.module.css'
import Avatar from '@material-ui/core/Avatar';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import { useAuth } from '../../AuthProvider';
import { ModalContext } from './ModalContextProvider/ModalContextProvider';
import { useHistory, useParams } from "react-router-dom";
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from 'axios'
import Dialog from "./Followers_Following_Dialog/Dialog";
import IconButton from '@material-ui/core/IconButton'
import { DropzoneDialog } from 'material-ui-dropzone'
import Navbar from "../Navbar/Navbar";
import PictureModal from './PictureModal/PictureModal'

function Profile(props) {
    const [picture, setPicture] = useState(null)
    const [name, setName] = useState(null)
    const [folllowersFollowing, changeFollowersFollowing] = useState(null);
    const [includesID, setIncludesID] = useState(false);
    const [pictures, changePictures] = useState(null)
    const [open, setOpen] = useState(false)
    const [shown, setShown] = useState(false)
    const [attributes, setAttributes] = useState("")
    const { currentUser } = useAuth();
    const history = useHistory();
    const params = useParams();
    const { openFollowersModal, openFollowingModal, openFollowersDialog, openFollowingDialog } = useContext(ModalContext);

    useEffect(() => {
        // Verify if the current user is already following the other user and change state accordingly
        if (folllowersFollowing !== null) {
            setIncludesID(folllowersFollowing.followers.some(user => user._id === currentUser.uid));
        }

    }, [folllowersFollowing, changeFollowersFollowing, setIncludesID, includesID]);

    //fetching the data for the profile only if the user is logged in
    useEffect(() => {
        if (currentUser === null) {
            history.push('/signin')
        } else if (currentUser === undefined) {

        } else {
            axios.get('/users/' + params.id)
                .then(function (response) {
                    setName(response.data.name);
                    changeFollowersFollowing({ "followers": response.data.followers, "following": response.data.following })
                    setPicture(response.data.avatar);
                })
                .catch(function (error) {
                    console.log(error);
                })
            axios.get(`/posts/${params.id}`).then((res) => {
                const { data } = res;
                changePictures(data);
            })
        }
    }, [currentUser, history, params.id])

    function TryFollow() {
        // Here the current user is looking at another user's profile page
        if (includesID) {
            axios.post('/users/unfollow', {
                uid: currentUser.uid,
                following_uid: params.id,
            })
                .then(function (response) {
                    console.log('unfollow', response);
                    changeFollowersFollowing({ "followers": response.data.followedUser.followers, "following": response.data.followedUser.following });
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
                    changeFollowersFollowing({ "followers": response.data.followedUser.followers, "following": response.data.followedUser.following })
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }

    //the popup needs to get the props from the clicked picture before opening
    useEffect(() => {
        if (attributes === "")
            setOpen(false)
        else 
            setOpen(true)
    }, [attributes])

    //similar working to the upload component that receives a picture to change the avatar
    function saveAvatar(event){
        const formData = new FormData();
        formData.append('avatar', event[0]);
        formData.append('uid', currentUser.uid);
        axios.post('/users/avatar', formData
        ).then((res) => {
            console.log(res);
            setPicture(res.data.data);
        });
        setShown(false);
    }

    if (picture === null || name === null || folllowersFollowing == null || pictures == null)
        return (<div className={classes.profile_loading}>
            <CircularProgress size='100px'/>
        </div>)

    let clickableAvatar = null;
    if (currentUser.uid === params.id) {
        clickableAvatar = <IconButton>
            <Avatar alt={name} src={picture} onClick={() => { setShown(true) }} style={{ height: '150px', width: '150px' }} />
            <DropzoneDialog
                open={shown}
                onSave={saveAvatar}
                acceptedFiles={['image/jpeg', 'image/png', 'image/bmp']}
                showPreviews={false}
                showPreviewsInDropzone={true}
                maxFileSize={1000000}
                filesLimit={1}
                onClose={() => { setShown(false) }}>
            </DropzoneDialog>
        </IconButton>

    } else {
        clickableAvatar = <Avatar alt={name} src={picture} style={{ height: '150px', width: '150px' }} />
    }

    //like function for the popup's props
    function handleLike(index){
        let temp = pictures
        if (temp[index].likes.includes(currentUser.name)){
            for (let i = 0; i < temp[index].likes.length; i++){
                if (temp[index].likes[i] === currentUser.name){
                    temp[index].likes.splice(i, 1);
                    break;
                }
            }
        }
        else {
            temp[index].likes.push(currentUser.name)
        }
        changePictures(temp)
    }

    //comment function for the popup's props
    function handleComment(index, content){
        let temp = pictures
        temp[index].comments.push({"person": currentUser.name, "content": content})
        changePictures(temp)
    }

    return (
        <React.Fragment>
            <Navbar />
            <div className={classes.profile_container}>
                <div className={classes.profile_top}>
                    {clickableAvatar}
                    <table className={classes.profile_stats}>
                        <tbody>
                            <tr>
                                <td colSpan="2">
                                    <h1 className={classes.profile_name}>{name}</h1>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <span className={classes.profile_stats} onClick={() => openFollowersDialog(true)} style={{ cursor: 'pointer' }}>
                                        Followers: {folllowersFollowing.followers.length}
                                    </span>
                                </td>
                                <td>
                                    <span className={classes.profile_stats} onClick={() => openFollowingDialog(true)} style={{ cursor: 'pointer' }}>
                                        Following: {folllowersFollowing.following.length}
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    {
                        currentUser.uid === params.id ? <div /> :
                            includesID ? <div><Button variant="outlined" onClick={TryFollow}>Unfollow</Button></div> :
                                <div> <Button variant="outlined" onClick={TryFollow}>Follow</Button></div>
                    }
                </div>
                <GridList cellHeight={250} style={{ width: "100%", cursor: 'pointer' }} cols={3}>
                    {pictures.map((tile, index) => (<GridListTile key={tile._id} cols={tile.cols || 1} rows={tile.rows || 1} onClick={(event) => setAttributes(event.target.attributes)}>
                        <img src={tile.imageUrl} alt={tile.caption} likedby={JSON.stringify(tile.likes)} comments={JSON.stringify(tile.comments)} id={tile._id} index={index} />
                    </GridListTile>))}
                </GridList>
                {openFollowersModal ? <Dialog contentStyle={{ maxWidth: 300 }} type={"followers"} data={folllowersFollowing.followers} /> : null}
                {openFollowingModal ? <Dialog type={"following"} data={folllowersFollowing.following} /> : null}
                <Modal open={open} onClose={() => {
                    setOpen(false)
                    setAttributes("")
                }}>
                   {open ?  <PictureModal commentFunction={handleComment} likeFunction={handleLike} comments={JSON.parse(attributes.getNamedItem("comments").value)} likedBy={JSON.parse(attributes.getNamedItem("likedby").value)} postID={attributes.getNamedItem("id").value} caption={attributes.getNamedItem("alt").value} source={attributes.getNamedItem("src").value} index={attributes.getNamedItem("index").value}/>: null}
                </Modal>
            </div>
        </React.Fragment>
    )
}

export default Profile;