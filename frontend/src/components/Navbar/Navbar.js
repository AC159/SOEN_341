import React, {useState, useEffect} from 'react';
import classes from './Navbar.module.css';
import Logo from '../Logo/Logo';
import { useHistory } from "react-router-dom";
import { useAuth } from '../../AuthProvider';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import FeaturedPlayListIcon from '@material-ui/icons/FeaturedPlayList';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import CreateIcon from '@material-ui/icons/Create';

const buttons = [
    {label:"Posts", icon: <FeaturedPlayListIcon/>, link: "/"},
    {label:"Profile", icon: <AccountBoxIcon/>, link: "/profile"},
    {label:"Sign In", icon: <CreateIcon/>, link: "/signup"},
]

const Navbar = (props) => {
    const [page, changePage] = useState(0);
    const { currentUser, signout } = useAuth();
    const history = useHistory();

    return (
        <header className={classes.Navbar}>

            <div className={classes.Logo}>
                <Logo />
            </div>

            <nav className={classes.NavigationItem}>
                <BottomNavigation showLabels value={page} onChange={(event, newPage) => {changePage(newPage);}}>
                    {buttons.map((button) => <BottomNavigationAction label={button.label} icon={button.icon} onClick={() => {history.push(button.link)}} />)}
                </BottomNavigation>
            </nav>
        </header>
    );

}

export default Navbar;
