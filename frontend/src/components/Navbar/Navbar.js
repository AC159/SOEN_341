import React from 'react';
import classes from './Navbar.module.css';
import Logo from '../Logo/Logo';
import { NavLink } from "react-router-dom";
import Upload from '../Images/Upload/Upload'

const navbar = (props) => {

    return (
        <header className={classes.Navbar}>

            <div className={classes.Logo}>
                <Logo />
            </div>

            <nav className={classes.NavigationItem}>
                <ul>
                    <li>
                        <NavLink to="/" >Posts</NavLink>
                    </li>

                    <li>
                        <NavLink to="/profile" >Profile</NavLink>
                    </li>

                    <li>
                        <Upload />
                    </li>
                </ul>
            </nav>
        </header>
    );

}

export default navbar;
