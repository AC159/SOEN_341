import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Posts from '../src/components/Posts/Posts';
import Navbar from "./components/Navbar/Navbar";
import classes from "./components/Layout/Layout.module.css";


class App extends React.Component {

    render () {

      return (

          <BrowserRouter>
              <div>

                  <Navbar />

                  <main className={classes.Content}>

                      <Switch>

                          <Route path="/profile" render={() =>  {
                              return <h2>My profile</h2>;
                          }}  />

                          <Route path="/" component={Posts}/>

                      </Switch>

                  </main>

              </div>
          </BrowserRouter>
      );
  }

}

export default App;
