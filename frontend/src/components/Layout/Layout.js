import React, { Component } from 'react';
import Navbar from '../Navbar/Navbar';
import Aux from '../../hoc/Aux/Aux';
import classes from "./Layout.module.css";

class Layout extends Component {


    render () {

        return (
            <Aux>
                <Navbar />

                <main className={classes.Content}>
                    {this.props.children}
                </main>
            </Aux>
        );

    }

}

export default Layout;
