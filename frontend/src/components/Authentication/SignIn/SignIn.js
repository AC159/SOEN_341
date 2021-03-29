import React, {useState, useEffect} from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useAuth } from '../../../AuthProvider';
import wallStreetBets from "../../../../src/assets/images/wallStreetBets.jpg";
import classes from './SignIn.module.css';

function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const { signin, currentUser } = useAuth();
    const history = useHistory();

    const submitForm = () => {
        // signs in user and then redirect to main page
        signin(email, password).then(() =>{
            setTimeout(() =>{
                history.replace('/');
            }, 500)
        })
        .catch(e => {
            setError(e.message)
        })
    }
    useEffect(() => {
        if (currentUser !== null){
            history.push('/')
        }
    }, [currentUser, history])

    return (

        <div className={classes.super_container}>
            <div className={classes.container}>

                <div className={classes.container_image}>
                    <img src={wallStreetBets} alt="WallStreet Bets logo"/>
                </div>

                <div className={classes.container_title}>Sign in to see pictures of your friends!</div>

                <form className={classes.container_item}>

                    <label>email</label>
                    <input type="text" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="email"/>

                    <label>password</label>
                    <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="password"/>

                </form>

                {error ? <div className={classes.container_error}>There was an error while attempting to sign in</div> : null}

                <button type="submit" className={classes.submit_button} onClick={submitForm} disabled={email === "" || password === ""}>Sign in!</button>
                <div className={classes.container_footer}>Don't have an account yet? <Link to="/signup"> Sign up!</Link></div>

            </div>
        </div>
    )
}

export default SignIn
