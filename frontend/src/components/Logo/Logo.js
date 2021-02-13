import React from 'react';
import classes from './Logo.module.css';
import instagramLogo from '../../assets/images/insta_logo.png';


const logo = (props) => {

    return (
        <div className={classes.Logo} >
            <img src={instagramLogo} alt="Instagram Logo"/>
        </div>
    );

}

export default logo;
