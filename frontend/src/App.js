import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Posts from '../src/components/Posts/Posts';
import Navbar from "./components/Navbar/Navbar";
import classes from "./components/Layout/Layout.module.css";
import SignUp from './components/SignUp/SignUp'
import SignIn from './components/SignIn/SignIn'
import Profile from './components/Profile/Profile'
import AuthProvider from "./AuthProvider";
// import { auth } from './firebase';

function App(){
      return (
        <BrowserRouter>
            <AuthProvider>
                <div>
                    <Navbar />
                    <main className={classes.Content}>
                        <Switch>
                            <Route exact path="/profile/:id" component={Profile}/>

                            <Route exact path="/signup" component={SignUp}/>

                            <Route exact path="/signin" component={SignIn}/>

                            <Route exact path="/" component={Posts}/>

                        </Switch>
                    </main>
                </div>
            </AuthProvider>
        </BrowserRouter>
      );
}

export default App;
