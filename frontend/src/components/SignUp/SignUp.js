import React, {useState} from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useAuth } from '../../AuthProvider';

function SignUp() {
    const history = useHistory();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(false);
    const { signup } = useAuth();

    const submitForm = async () => {
        if(password !== confirmPassword)
            setError('Passwords do not match')
        else {
            signup(email, password).then(() => {
                history.push('/')
            }).catch(e => {
                setError(e.message)
            });
        }
    }

    return (
        <div>
            <br/>
            {error ? <p style={{color: 'red'}}>{error}</p> : null}
            <h3>Sign Up</h3>
            <br/>
            <label>Email</label>
            <input value={email} onChange={e => {
                setEmail(e.target.value.trim());
                setError(false);
            }} type="email"/>
            <br/>
            <br/>
            <label>Password</label>
            <input value={password} onChange={e => {
                setPassword(e.target.value.trim());
                setError(false);
            }} type="password"/>
            <br/>
            <br/>
            <label>Confirm Password</label>
            <input value={confirmPassword} onChange={e => {
                setConfirmPassword(e.target.value.trim());
                setError(false);
            }} type="password"/>
            <p>Already have an account? <Link to="/signin">Sign In</Link></p>
            <button onClick={() => submitForm()}>Sign Up</button>
        </div>
    )
}

export default SignUp
