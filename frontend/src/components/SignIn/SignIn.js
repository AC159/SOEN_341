import React, {useState} from 'react';
import { auth } from '../../firebase';
import { Link, useHistory } from 'react-router-dom';

function SignIn() {
    const history = useHistory();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);

    const submitForm = () => {
        auth.signInWithEmailAndPassword(email, password).then(() =>{
            history.push('/')
        }).catch(e => {
            setError(e.message)
        })
    }

    return (
        <div>
            <br/>
            {error ? <p style={{color: 'red'}}>{error}</p> : null}
            <h3>Sign In</h3>
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
                setPassword(e.target.value.trim())
                setError(false);
            }} type="password"/>
            <p>Don't have an account? <Link to="signup">Sign Up</Link></p>
            <button onClick={() => submitForm()}>Sign In</button>
        </div>
    )
}

export default SignIn
