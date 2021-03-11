import React, { useState } from 'react';
import classes from './Navbar.module.css';
import Logo from '../Logo/Logo';
import { useHistory } from "react-router-dom";
import { useAuth } from '../../AuthProvider';
import UploadButton from '../Images/Upload/Upload'
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import FeaturedPlayListIcon from '@material-ui/icons/FeaturedPlayList';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import CreateIcon from '@material-ui/icons/Create';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import PersonOutline from '@material-ui/icons/PersonOutline';
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';

const Navbar = (props) => {
    const [page, changePage] = useState(0);
    const { currentUser, signout } = useAuth();
    const history = useHistory();

    function getButtons() {
        if (currentUser == null) {
            const buttonsNotSignedIn = [
                { label: "Posts", icon: <FeaturedPlayListIcon />, link: "/" },
                { label: "Sign In", icon: <CreateIcon />, link: "/signin" }
            ];
            return buttonsNotSignedIn;
        }
        else {
            const buttonsSignedIn = [
                { label: "Posts", icon: <FeaturedPlayListIcon />, link: "/" },
                { label: "Profile", icon: <AccountBoxIcon />, link: "/profile/" + currentUser.uid},
                { label: "Sign Out", icon: <PersonOutline />, link: "/signout" }
            ];
            return buttonsSignedIn;
        }
    }
    console.log(currentUser)
    function Upload() {
        if (currentUser == null) {
            return (
                <Button onClick={() => {history.push("/signin")}} classes={{ root: classes.UploadButton }} >
                    <AddAPhotoIcon />
                </Button>
            );
        }
        return (
            <UploadButton />
        );

    }
    return (
        <header className={classes.Navbar}>

            <div className={classes.Logo}>
                <Logo />
            </div>
            <Upload />
            <div>
                <TextField id="outlined-basic" label="Search user..." variant="outlined" margin='dense' style={{ height: 40, marginTop: '5px' }} />
                <Button variant="outlined" style={{ height: 40, marginTop: '5px' }}>Search</Button>
            </div>
            <nav className={classes.NavigationItem}>
                <BottomNavigation showLabels value={page} onChange={(event, newPage) => { changePage(newPage); }}>
                    {getButtons().map((button, index) => <BottomNavigationAction key={index} label={button.label} icon={button.icon} onClick={() => { history.push(button.link) }} classes={{ wrapper: classes.NavbarButton }} />)}
                </BottomNavigation>
            </nav>
        </header>
    );

}

export default Navbar;
