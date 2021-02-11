import React from 'react';
import classes from './Navbar.module.css';
import Logo from '../Logo/Logo';
import NavigationItems from './NavigationItems/NavigationItems';

const navbar = (props) => {

    return (
        <header className={classes.Navbar}>

            <div className={classes.Logo}>
                <Logo />
            </div>

            <nav>
                <NavigationItems />
            </nav>
        </header>
    );

}

export default navbar;
