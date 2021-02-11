import React from "react";
import Home from './Home';
import Profile from './Profile';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

function App() {
  return (
    <Router>
      <Switch>
       <Route path="/profile">
          <Profile/>
        </Route>

        <Route path="/">
          <Home/>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
