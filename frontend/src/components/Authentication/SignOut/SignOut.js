import Button from '@material-ui/core/Button';
import React, {useState} from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useAuth } from '../../../AuthProvider';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';


function SignOut() {
    const { signout } = useAuth();
    const history = useHistory();
    console.log("e")
    signout().then(async () => {
        history.push('/')
    }).catch(e => {
        alert(e.message)
    });
    return null
}

export default SignOut;