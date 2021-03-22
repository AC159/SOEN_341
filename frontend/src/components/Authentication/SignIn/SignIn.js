import React, {useState} from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useAuth } from '../../../AuthProvider';
import classes from './SignIn.module.css';
import TextField from '@material-ui/core/TextField';
import FormHelperText from '@material-ui/core/FormHelperText';

import IconButton from '@material-ui/core/IconButton';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const [showPassword, changeShowPassword] = useState(false)
    const { signin } = useAuth();
    const history = useHistory();

    const submitForm = () => {
        signin(email, password).then(() =>{
            history.replace('/');
        })
        .catch(e => {
            setError(e.message)
        })
    }

    return (

        <table className={classes.SignInTable}>
            <tbody>
             <tr>
                <td>
                    <h2>Sign in to see photos from your friends!</h2>
                </td>
            </tr>
            <tr>
                <td>
                    <TextField label="Email" variant="outlined" value={email} onChange={(event) => setEmail(event.target.value)} error={error} fullWidth style = {{width: 300}} helperText=" "/>
                </td>
            </tr>
            <tr>
                <td>
                    <FormControl  variant="outlined" error={error} style = {{width: 300}}>
                        <InputLabel>Password</InputLabel>
                            <OutlinedInput
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                labelWidth={70}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton onMouseDown={(event) => {event.preventDefault()}} onClick={() => changeShowPassword(!showPassword)}>
                                                {showPassword ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                             />
                    </FormControl>
                    <FormHelperText error margin='dense' className={{error: classes.ErrorText}}>{error ? "There was an error while attempting to sign in" : " "}</FormHelperText>
                </td>
            </tr>
            <tr>
                <td>
                    <Button variant="outlined" size="large" color="primary" onClick={submitForm} disabled={email === "" || password === ""}>
                        Sign In
                    </Button>
                </td>
            </tr>
            <tr>
                <td>
                    <h3>Don't have an account yet? <Link to="/signup"> Sign up</Link></h3>
                </td>
            </tr>
            </tbody>
        </table>
    )
}

export default SignIn
