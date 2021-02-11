import React, {useState, useEffect} from 'react'
import {Link} from "react-router-dom";
import axios from 'axios';

function Home() {
    const [serverMessage, setServerMessage] = useState('Loading server message...');

    useEffect(() => {
        async function getServerMessage() {
            const res = await axios.get('/users');
            setServerMessage(res.data.message)
        }

        getServerMessage()
    },[])

    return (
        <div>
            <h1>
                Home
            </h1>

            <Link to="/profile">Go to Profile</Link>

            <p>{serverMessage}</p>
        </div>
    )
}

export default Home;
