import React, {useState, useEffect} from 'react';
import classes from './Navbar.module.css';
import Logo from '../Logo/Logo';
import { NavLink } from "react-router-dom";
import { useAuth } from '../../AuthProvider';

const Navbar = (props) => {
    const { currentUser, signout } = useAuth();

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
                        {currentUser ? <span onClick={() => signout()}>Sign Out</span>: <NavLink to="/signup" >Sign Up</NavLink>}
                    </li>
                </ul>
            </nav>
        </header>
    );

}

export default Navbar;
