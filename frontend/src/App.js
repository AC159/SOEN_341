import Layout from '../src/components/Layout/Layout';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Post from '../src/components/Posts/Post/Post';
import './App.css';

function App() {

  return (

      <BrowserRouter>
        <div className="App">

                <Layout>

                    {/*  Put user posts here!  */}

                    <Switch>

                        <Route path="/profile" render={() =>  {
                            return <h2>My profile</h2>;
                        }}  />

                        <Route path="/" component={Post}/>

                    </Switch>

                </Layout>

        </div>
      </BrowserRouter>
  );

}

export default App;
