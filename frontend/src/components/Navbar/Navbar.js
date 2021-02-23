import React, {useState} from 'react';
import classes from './Navbar.module.css';
import Logo from '../Logo/Logo';
import { useHistory } from "react-router-dom";
import { useAuth } from '../../AuthProvider';
import Upload from '../Images/Upload/Upload'
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import FeaturedPlayListIcon from '@material-ui/icons/FeaturedPlayList';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import CreateIcon from '@material-ui/icons/Create';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import PersonOutline from '@material-ui/icons/PersonOutline';

var buttons = []

const buttons1 = [
    {label:"Posts", icon: <FeaturedPlayListIcon/>, link: "/"},
    {label:"Sign In", icon: <CreateIcon/>, link: "/signin"}
]

const buttons2 = [
    {label:"Posts", icon: <FeaturedPlayListIcon/>, link: "/"},
    {label:"Profile", icon: <AccountBoxIcon/>, link: "/profile/12"},
    {label:"Sign Out", icon: <PersonOutline/>, link: "/signout"}
]

const Navbar = (props) => {
    const [page, changePage] = useState(0);
    const { currentUser, signout } = useAuth();
    const history = useHistory();

    if (currentUser == null){
        buttons = buttons1;
    }
    else{
        buttons = buttons2;
    }


    return (
        <header className={classes.Navbar}>

            <div className={classes.Logo}>
                <Logo />
            </div>
            <Upload/>
            <div>
                <TextField id="outlined-basic" label="Search user..." variant="outlined" margin='dense' style={{height: 40, marginTop:'5px'}}/>
                <Button variant="outlined" style={{height: 40, marginTop:'5px'}}>Search</Button>
            </div>
            <nav className={classes.NavigationItem}>
                <BottomNavigation showLabels value={page} onChange={(event, newPage) => {changePage(newPage);}}>
                    {buttons.map((button, index) => <BottomNavigationAction key={index} label={button.label} icon={button.icon} onClick={() => {history.push(button.link)}} classes={{wrapper:classes.NavbarButton}}/>)}
                </BottomNavigation>
            </nav>
        </header>
    );

}

export default Navbar;
