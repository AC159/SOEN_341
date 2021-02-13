import React, {Component} from 'react';
import Post from './Post/Post';
import axios from "axios";

class Posts extends Component {

    state = {
        users: []
    }

    componentDidMount() {

        axios.get('/users')
            .then((res) => {
                this.setState({
                    users: res.data.users
                });
            });

    }

   render () {

        let array = [...this.state.users];
        const users = array.map((user) => {
            return <Post name={user} />;
        })

       return (
           <div>
               {users}
           </div>
       );

   }

}

export default Posts;
