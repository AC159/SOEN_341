import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { auth } from './firebase';

const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext);
}

function AuthProvider({children}) {
    const [currentUser, setCurrentUser] = useState();

    // signs up a user with email and password
    const signup = (email, password) => {
        return auth.createUserWithEmailAndPassword(email, password);
    }

    // signs in a user with email and password
    const signin = (email, password) => {
        return auth.signInWithEmailAndPassword(email, password);
    }

    // signs out a user
    const signout = () => {
        return auth.signOut();
    }

    // initialize the current user whenever a user signs in
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async user => {
            if(user && user.uid) {
                const res = await axios.get(`/users/${user.uid}`);
                user = {
                    ...user,
                    ...res.data
                };
            }
            setCurrentUser(user);
        })

        return unsubscribe;
    }, [])

    // value will be passed down using the Provider API
    const value = {
        currentUser,
        signup,
        signin,
        signout
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider
