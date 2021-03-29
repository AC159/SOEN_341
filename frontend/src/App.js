import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Posts from '../src/components/Posts/Posts';
import classes from "./components/Layout/Layout.module.css";
import SignUp from './components/Authentication/SignUp/SignUp'
import SignIn from './components/Authentication/SignIn/SignIn'
import Profile from './components/Profile/Profile'
import AuthProvider from "./AuthProvider";
import SignOut from './components/Authentication/SignOut/SignOut';
import ModalContextProvider from "./components/Profile/ModalContextProvider/ModalContextProvider";

function App() {

      return (
        <BrowserRouter>
            <AuthProvider>
                <div>
                    <main className={classes.Content}>
                        <ModalContextProvider>
                        <Switch>
                            <Route exact path="/profile/:id" component={Profile}/>

                            <Route exact path="/signup" component={SignUp}/>

                            <Route exact path="/signin" component={SignIn}/>

                            <Route exact path="/signout" component={SignOut}/>

                            <Route exact path="/" component={Posts}/>
                        </Switch>
                        </ModalContextProvider>
                    </main>
                </div>
            </AuthProvider>
        </BrowserRouter>
      );
}

export default App;
