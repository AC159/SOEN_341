import React from 'react';
import NavigationItem from './NavigationItem/NavigationItem';
import classes from './NavigationItems.module.css';

const navigationItems = (props) => {

    return (
        <ul className={classes.NavigationItems}>
            <NavigationItem link="/">Posts</NavigationItem>
            <NavigationItem link="/profile"> Profile</NavigationItem>
        </ul>
    );

}

export default navigationItems;
