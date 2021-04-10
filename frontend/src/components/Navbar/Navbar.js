import React, {useEffect, useState, useRef} from 'react';
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
import Autocomplete from '@material-ui/lab/Autocomplete';
import Button from '@material-ui/core/Button';
import PersonOutline from '@material-ui/icons/PersonOutline';
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import axios from 'axios';

const Navbar = (props) => {
    const [page, changePage] = useState(0);
    const [searchUser, setSearchUser] = useState("");
    const [filteredUsers, setFilteredUsers] = useState([{name: "No results"}]);
    const [value, setValue] = useState();
    const { currentUser, signout } = useAuth();
    const history = useHistory();
    const inputRef = useRef(null);

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
    function Upload() {
        if (currentUser == null) {
            return (
                <Button onClick={() => {history.push("/signin")}} classes={{ root: classes.uploadButton }} >
                    <AddAPhotoIcon />
                </Button>
            );
        }
        return (
            <UploadButton currentUser={currentUser} />
        );

    }

    // this useEffect executes only when searchUser changes
    useEffect(() => {

        const timer = setTimeout(() => {

            if (inputRef.current.value === null || inputRef.current.value === undefined || inputRef.current.value === "") {
                return;
            }

            // searchUser will be the old value at the moment the time was set
            // Fetch the db only when the user has stopped typing
            if (searchUser === inputRef.current.value) {
                axios.get(`/users/search/${searchUser}`).then(response => {
                    console.log(response);
                    const array = [];
                    for (let i = 0; i < response.data.users.length; i++) {
                        array.push({
                            name: response.data.users[i].name,
                            uid: response.data.users[i]._id
                        })
                    }
                    setFilteredUsers(array);
                });
            }

        }, 500);

        // Function that runs before the next time useEffect will run
        return () => {
            // this ensures we only have one time running
            clearTimeout(timer);
        };

    }, [searchUser, inputRef]);

    return (
        <header className={classes.navbar}>

            <div className={classes.logo}>
                <Logo />
            </div>
            <Upload />
            <div>

                <Autocomplete
                    id="combo-box-demo"
                    onChange={(event, option) => {
                        if (option != undefined && option != null) {
                            history.replace(`/profile/${option.uid}`);
                            setSearchUser("");
                        }
                    }}
                    options={filteredUsers}
                    getOptionLabel={(option) => option.name}
                    style={{ width: 300 }}
                    renderInput={(params) => (
                        <TextField {...params} id="outlined-basic" inputRef={inputRef} value={searchUser} onChange={event => setSearchUser(event.target.value)}
                        label="Search user..." variant="outlined" margin='dense' style={{ height: 40, marginTop: '5px' }} />
                        )}
                />
            </div>
            <nav className={classes.navigationItem}>
                <BottomNavigation showLabels value={page} onChange={(event, newPage) => { changePage(newPage); }}>
                    {getButtons().map((button, index) => <BottomNavigationAction key={index} label={button.label} icon={button.icon} onClick={() => { history.push(button.link) }} classes={{ wrapper: classes.navbarButton }} />)}
                </BottomNavigation>
            </nav>
        </header>
    );

}

export default Navbar;
