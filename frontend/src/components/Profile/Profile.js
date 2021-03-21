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
import { useHistory, useParams } from "react-router-dom";
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from 'axios'
import Dialog from "./Followers_Following_Dialog/Dialog";
import IconButton from '@material-ui/core/IconButton'
import { DropzoneDialog } from 'material-ui-dropzone'

function Profile(props) {
    const [picture, setPicture] = useState(null)
    const [name, setName] = useState(null)
    const [folllowersFollowing, changeFollowersFollowing] = useState(null);
    const [includesID, setIncludesID] = useState(false);
    const [pictures, changePictures] = useState(null)
    const [open, setOpen] = useState(false)
    const [shown, setShown] = useState(false) 
    const [attributes, setAttributes] = useState("")
    const [comments, changeComments] = useState(null)
    const [like, changeLike] = useState(null)
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
                changePictures(data)
            })
        }
    }, [currentUser, history, params.id])

    useEffect(() => {
        if (attributes === "");
        else {
            setOpen(true);
        }
    }, [attributes])

    function postComment() {
        let temp = comments || JSON.parse(attributes.getNamedItem("comments").value)
        temp.push({ id: temp.length + 1, person: currentUser.name, content: text })
        changeComments(temp)
        changeText("")
        axios.post('/posts/comment', {
            comment: text,
            imageUrl: attributes.getNamedItem("src").value,
            uid: currentUser.uid,
            name: currentUser.name,
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

    const postLike = () => {
        axios.post('/posts/like', {
            uid: currentUser.uid,
            name: currentUser.name,
            postID: attributes.getNamedItem("id").value
        }).then((response) => {
            if (like === null && !JSON.parse(attributes.getNamedItem("likedby").value).includes(currentUser.name))
                changeLike(JSON.parse(attributes.getNamedItem("likedby").value).concat(currentUser.name))
            else if (like !== null && !like.includes(currentUser.name))
                changeLike(like.concat(currentUser.name))
        }).catch((error) => {
            console.log(error)
        });
    }

    const saveAvatar = (event) =>{
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
        return (<div className={classes.loading}>
            <CircularProgress size='100px' />
        </div>)

    let clickableAvatar = null;
    if (currentUser.uid === params.id) {
            clickableAvatar = <IconButton>
            <Avatar alt={name} src={picture} onClick={() => {setShown(true)}} style={{ height: '150px', width: '150px' }} />
            <DropzoneDialog
                open={shown}
                onSave={saveAvatar}
                acceptedFiles={['image/jpeg', 'image/png', 'image/bmp']}
                showPreviews={false}
                showPreviewsInDropzone={true}
                maxFileSize={1000000}
                filesLimit={1}
                onClose={() => {setShown(false)}}>
            </DropzoneDialog>
        </IconButton>

    } else {
        clickableAvatar = <Avatar alt={name} src={picture} style={{ height: '150px', width: '150px' }} />
    }

    return (
        <div className={classes.ProfileContainer}>
            <div className={classes.ProfileTop}>
                {clickableAvatar}
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
                    currentUser.uid === params.id ? <div /> :
                        includesID ? <div><Button variant="outlined" onClick={TryFollow}>Unfollow</Button></div> :
                            <div> <Button variant="outlined" onClick={TryFollow}>Follow</Button></div>
                }
            </div>
            <GridList cellHeight={250} style={{ width: "100%" }} cols={3}>
                {pictures.map((tile) => (<GridListTile key={tile._id} cols={tile.cols || 1} rows={tile.rows || 1} onClick={(event) => {
                    setAttributes(event.target.attributes)
                }}>
                    <img src={tile.imageUrl} alt={tile.caption} likedby={JSON.stringify(tile.likes)} comments={JSON.stringify(tile.comments)} id={tile._id} />
                </GridListTile>))}
            </GridList>

            {openFollowersModal ? <Dialog type={"followers"} data={folllowersFollowing.followers} /> : null}

            {openFollowingModal ? <Dialog type={"following"} data={folllowersFollowing.following} /> : null}

            <Modal open={open} onClose={() => {
                setOpen(false)
                setAttributes("")
                changeComments(null)
            }}>
                {attributes === "" ? null :
                    <div className={classes.Popup}>
                        <div>
                            <div className={classes.PopupPicture}>
                                <img src={attributes.getNamedItem("src").value} alt={attributes.getNamedItem("alt").value} style={{ maxHeight: '75vh', maxWidth: "80vw" }} />
                            </div>
                            <h3 style={{ marginTop: '5px', marginBottom: '-10px' }}>{attributes.getNamedItem("alt").value}</h3>
                            <div className={classes.ProfileCaption}>
                                {/* <h4>Liked by {attributes.getNamedItem("likedby").value}</h4> */}
                                <h4>{like === null ? JSON.parse(attributes.getNamedItem("likedby").value).length > 2 ? "Liked by " + JSON.parse(attributes.getNamedItem("likedby").value)[0] + ", " + JSON.parse(attributes.getNamedItem("likedby").value)[1] + " and many others" : JSON.parse(attributes.getNamedItem("likedby").value).length === 0 ? "" : "Liked by " + JSON.parse(attributes.getNamedItem("likedby").value).join(", ") :
                                    like.length > 2 ? "Liked by " + like[0] + ", " + like[1] + " and many others" : like.length === 0 ? "" : "Liked by " + like.join(", ")}</h4>
                                <Button variant="outlined" size="small" style={{ height: 40, marginLeft: 'auto' }} onClick={() => postLike()}>Like</Button>
                            </div>
                        </div>
                        <div className={classes.ProfileComment}>
                            <div className={classes.ProfileCommentScroll}>
                                {comments === null ? JSON.parse(attributes.getNamedItem("comments").value).map(item => {
                                    return (<p className="Post-comments"><b>{item.person}</b>{item.content}</p>)
                                }) : comments.map(item => {
                                    return (<p className="Post-comments"><b>{item.person}</b>{item.content}</p>)
                                })}
                            </div>
                            <div style={{ marginTop: '10px' }}>
                                <TextField id="outlined-basic" label="Comment..." variant="outlined" style={{ marginLeft: "10px", width: '80%' }} value={text} onChange={(event) => changeText(event.target.value)} />
                                <Button variant="outlined" onClick={postComment} style={{ height: 56 }} >Post</Button>
                            </div>
                        </div>
                    </div>}

            </Modal>
        </div>
    )
}

export default Profile;