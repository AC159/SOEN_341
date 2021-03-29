import React, {useState, useEffect} from 'react';
import {Link, useHistory } from 'react-router-dom';
import { useAuth } from '../../../AuthProvider';
// import TextField from '@material-ui/core/TextField';
// import IconButton from '@material-ui/core/IconButton';
// import OutlinedInput from '@material-ui/core/OutlinedInput';
// import InputLabel from '@material-ui/core/InputLabel';
// import InputAdornment from '@material-ui/core/InputAdornment';
// import FormHelperText from '@material-ui/core/FormHelperText';
// import FormControl from '@material-ui/core/FormControl';
// import Button from '@material-ui/core/Button';
// import Visibility from '@material-ui/icons/Visibility';
// import VisibilityOff from '@material-ui/icons/VisibilityOff';
import axios from 'axios';
import wallStreetBets from "../../../assets/images/wallStreetBets.jpg";
import classes from './SignUp.module.css';

const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

function SignUp() {
    const history = useHistory();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, changeShowPassword] = useState(false)
    const [errorEmail, setErrorEmail] = useState(false);
    const [errorPassword, setErrorPassword] = useState(false)
    const [errorConfirmPassword, setErrorConfirmPassword] = useState(false)
    const [name, changeName] = useState("")
    const { signup, signin } = useAuth();

    const submitForm = async () => {
        // signup an user, then sign the user in and finally redirects user to the main page
        signup(email, password).then(async (userData) => {
            await axios.post('/users/signup', {
                email: email,
                name: name,
                uid: userData.user.uid
            }).then(res => {
                console.log(res);
                signin(email, password).then(() =>{
                    history.replace('/');
                }).catch(e => {
                    console.log(e.message);
                })
            });
        }).catch(e => {
            console.log(e.message)
        });
    }

    useEffect(() => {
        if (emailRegex.test(String(email).toLowerCase()) || email === "") setErrorEmail(false)
        else setErrorEmail(true)
    }, [email])

    useEffect(() =>{
        if (password !== confirmPassword && password !== "" && confirmPassword !== "" ) setErrorConfirmPassword(true)
        else setErrorConfirmPassword(false)
    }, [confirmPassword, password])

    useEffect(() =>{
        if (passwordRegex.test(String(password).toLowerCase()) || password === "") setErrorPassword(false)
        else setErrorPassword(true)
    }, [password])

    return (

        <div className={classes.super_container}>
            <div className={classes.container}>

                <div className={classes.container_image}>
                    <img src={wallStreetBets} alt="WallStreet Bets logo"/>
                </div>

                <div className={classes.container_title}>Sign up to see pictures of your friends!</div>

                <form className={classes.container_item}>

                    <label>email</label>
                    <input type="text" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="email"/>
                    {errorEmail ? <div className={classes.container_error}>The email is not valid</div> : null}

                    <label>name</label>
                    <input type="text" value={name} onChange={(event) => changeName(event.target.value)} placeholder="name"/>

                    <label>password</label>
                    <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="password"/>
                    {errorPassword ? <div className={classes.container_error}>
                        The password must contain at least eight characters, at least one number, at least one special character, and both lower and upper case letters
                    </div> : null}

                    <label>confirm password</label>
                    <input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)}
                           placeholder="confirm password"/>
                    {errorConfirmPassword ? <div className={classes.container_error}>The passwords do not match</div> : null}

                </form>

                <button type="submit" className={classes.submit_button} onClick={submitForm}
                        disabled={errorEmail || name === "" || errorPassword || email === "" || password === "" || confirmPassword === "" || errorConfirmPassword}>
                    Sign up!
                </button>
                <div className={classes.container_footer}>Already have an account? <Link to="/signin"> Sign in!</Link></div>

            </div>
        </div>

        // <table className={classes.SignUpTable}>
        //     <tbody>
        //     <tr>
        //         <td>
        //             <h2>Sign up to see photos from your friends!</h2>
        //         </td>
        //     </tr>
        //     <tr>
        //         <td>
        //             <TextField label="Email" variant="outlined" value={email} onChange={(event) => setEmail(event.target.value)} error={errorEmail} fullWidth style = {{width: 300}}/>
        //             <FormHelperText error margin='dense' className={classes.ErrorText}>{errorEmail ? "The email is not valid": " "}</FormHelperText>
        //         </td>
        //     </tr>
        //     <tr>
        //         <td>
        //             <TextField label="Name" variant="outlined" value={name} onChange={(event) => changeName(event.target.value)} style = {{width: 300}}/>
        //             <FormHelperText error margin='dense' className={classes.ErrorText}> </FormHelperText>
        //         </td>
        //     </tr>
        //     <tr>
        //         <td>
        //             <FormControl  variant="outlined" error={errorPassword} style = {{width: 300}}>
        //                 <InputLabel>Password</InputLabel>
        //                     <OutlinedInput
        //                         type={showPassword ? 'text' : 'password'}
        //                         value={password}
        //                         onChange={(event) => setPassword(event.target.value)}
        //                         labelWidth={70}
        //                             endAdornment={
        //                                 <InputAdornment position="end">
        //                                     <IconButton onMouseDown={(event) => {event.preventDefault()}} onClick={() => changeShowPassword(!showPassword)}>
        //                                         {showPassword ? <Visibility /> : <VisibilityOff />}
        //                                     </IconButton>
        //                                 </InputAdornment>
        //                             }
        //                      />
        //             </FormControl>
        //             <FormHelperText error margin='dense' className={classes.ErrorText}>{errorPassword ?
        //             "The password must contain at least eight characters, at least one number, at least one special character, and both lower and upper case letters" : " "}</FormHelperText>
        //         </td>
        //     </tr>
        //     <tr>
        //         <td>
        //         <FormControl  variant="outlined" error={errorConfirmPassword} style = {{width: 300}}>
        //                 <InputLabel>Confirm Password</InputLabel>
        //                     <OutlinedInput
        //                         type={showPassword ? 'text' : 'password'}
        //                         value={confirmPassword}
        //                         onChange={(event) => setConfirmPassword(event.target.value)}
        //                         labelWidth={135}
        //                             endAdornment={
        //                                 <InputAdornment position="end">
        //                                     <IconButton onMouseDown={(event) => {event.preventDefault()}} onClick={() => changeShowPassword(!showPassword)}>
        //                                         {showPassword ? <Visibility /> : <VisibilityOff />}
        //                                     </IconButton>
        //                                 </InputAdornment>
        //                             }
        //                      />
        //             </FormControl>
        //             <FormHelperText error margin='dense' className={classes.ErrorText}>{errorConfirmPassword ? "The password do not match" : " "}</FormHelperText>
        //         </td>
        //     </tr>
        //     <tr>
        //         <td>
        //             <Button variant="outlined" size="large" color="primary" onClick={submitForm}
        //             disabled={errorEmail || name === "" || errorPassword || email === "" || password === "" || confirmPassword === "" || errorConfirmPassword}>
        //                 Sign up
        //             </Button>
        //         </td>
        //     </tr>
        //     <tr>
        //         <td>
        //             <h3>Already have an account? <Link to="/signin"> Sign in</Link></h3>
        //         </td>
        //     </tr>
        //     </tbody>
        // </table>
    )
}

export default SignUp
