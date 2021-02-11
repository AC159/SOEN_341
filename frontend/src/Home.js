import React from 'react'
import {Link} from "react-router-dom";

function Home() {
    return (
        <div>
            <h1>
                Home
            </h1>

            <Link to="/profile">Go to Profile</Link>
        </div>
    )
}

export default Home;
