import React, { useState, useEffect } from 'react';
import classes from './Profile.module.css'
import Avatar from '@material-ui/core/Avatar';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';

const AccountName = "DummyName"
const ProfilePictureSource = "https://cdn.mos.cms.futurecdn.net/z3rNHS9Y6PV6vbhH8w83Yn-1200-80.jpg"
const Numbers = {followers: 10, following: 17}
const Display = [
    {id: 1, img: 'https://cdn.mos.cms.futurecdn.net/z3rNHS9Y6PV6vbhH8w83Yn-1200-80.jpg', title: 'whatever', author: 'whatever', cols: 1, name: "fake", likedBy: "Bob, John, and 12 others"},
    {id: 2, img: 'https://cdn.mos.cms.futurecdn.net/z3rNHS9Y6PV6vbhH8w83Yn-1200-80.jpg', title: 'whatever', author: 'whatever', cols: 1, name: "fake", likedBy: "Bob, John, and 12 others"},
    {id: 3, img: 'https://cdn.mos.cms.futurecdn.net/z3rNHS9Y6PV6vbhH8w83Yn-1200-80.jpg', title: 'whatever', author: 'whatever', cols: 1, name: "fake", likedBy: "Bob, John, and 12 others"},
    {id: 4, img: 'https://cdn.mos.cms.futurecdn.net/z3rNHS9Y6PV6vbhH8w83Yn-1200-80.jpg', title: 'whatever', author: 'whatever', cols: 2, name: "fake", likedBy: "Bob, John, and 12 others"},
    {id: 5, img: 'https://cdn.mos.cms.futurecdn.net/z3rNHS9Y6PV6vbhH8w83Yn-1200-80.jpg', title: 'whatever', author: 'whatever', cols: 1, name: "fake", likedBy: "Bob, John, and 12 others"},
    {id: 6, img: 'https://cdn.mos.cms.futurecdn.net/z3rNHS9Y6PV6vbhH8w83Yn-1200-80.jpg', title: 'whatever', author: 'whatever', cols: 1, name: "fake", likedBy: "Bob, John, and 12 others"},
    {id: 7, img: 'https://cdn.mos.cms.futurecdn.net/z3rNHS9Y6PV6vbhH8w83Yn-1200-80.jpg', title: 'whatever', author: 'whatever', cols: 1, name: "fake", likedBy: "Bob, John, and 12 others"},
    {id: 8, img: 'https://cdn.mos.cms.futurecdn.net/z3rNHS9Y6PV6vbhH8w83Yn-1200-80.jpg', title: 'whatever', author: 'whatever', cols: 1, name: "fake", likedBy: "Bob, John, and 12 others"},
    {id: 9, img: 'https://cdn.mos.cms.futurecdn.net/z3rNHS9Y6PV6vbhH8w83Yn-1200-80.jpg', title: 'whatever', author: 'whatever', cols: 1, name: "fake", likedBy: "Bob, John, and 12 others"},
    {id: 10, img: 'https://media.wired.com/photos/598e35fb99d76447c4eb1f28/master/pass/phonepicutres-TA.jpg', title: 'whatever', author: 'whatever', cols: 2, name: "fake", likedBy: "Bob, John, and 12 others"},
]

function Profile(props){
    const [picture, setPicture] = useState(ProfilePictureSource)
    const [name, setName] = useState(AccountName)
    const [folllowersFollowing, changeFollowersFollowing] = useState(Numbers);
    const [pictures, changePictures] = useState(Display)
    const [open, setOpen] = useState(false)
    const [attributes, setAttributes] = useState("")
    const [inputBox, changeInputBox] = useState(false)

    useEffect(() => {
        if (attributes === "");
        else {
            setOpen(true);
        } 
    }, [attributes])

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
                <div> <Button variant="outlined" onClick={() => console.log("Followed")}>Follow</Button></div>
            </div>
            <GridList cellHeight={250} style={{width: "100%"}} cols={3}>
                {pictures.map((tile) => (<GridListTile key={tile.id} cols={tile.cols || 1} rows={tile.rows || 1} onClick={(event) => setAttributes(event.target.attributes)}>
                                            <img src={tile.img} alt={tile.title} name={tile.name} likedBy={tile.likedBy} />
                                        </GridListTile>))}
            </GridList>
            <Modal open={open} onClose={() => setOpen(false)}>
                
                    {attributes === "" ? null:
                    <div className={classes.Popup}>
                        <div className={classes.PopupPicture}>
                            <img src={attributes.getNamedItem("src").value} alt="Anonymous" style={{maxHeight:'75vh', maxWidth:"80vw"}}/>
                        </div>
                        <div className={classes.ProfileCaption}>
                            <h4>Liked by {attributes.getNamedItem("likedBy").value}</h4>
                            <Button variant="outlined" size="small"  style={{height: 40, marginLeft:'auto'}}>Like</Button>
                            <Button variant="outlined" size="small"  onClick={() => changeInputBox(!inputBox)} style={{height: 40}}>Leave a comment</Button>
                            
                        </div>
                        {inputBox ? <div className={classes.ProfileComment}>
                            <TextField id="outlined-basic" label="Comment..." variant="outlined" style={{width: "85%", height:50}} />
                            <Button variant="outlined" onClick={() => console.log("posted")} style={{width: "15%", height:55}} >Post</Button>
                        </div>: null}
                    </div>}
                
            </Modal>
        </div>
    )
}

export default Profile;