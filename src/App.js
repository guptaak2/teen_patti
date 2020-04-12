import React, { Component } from 'react';
import './App.css';
import fire from './config/Fire'
import Login from './components/Login';
import Cards from './components/Cards';

class App extends Component {

  constructor() {
    super();

    this.state = {
      user: {},
    }
  }

  componentDidMount() {
    this.authListener();
  }

  authListener() {
    fire.auth().onAuthStateChanged((user) => {
      console.log(user);
      if (user) {
        this.setState({ user });
      } else {
        this.setState({ user: null });
      }
    });
  }

  render() {
    return (
      <div className="App">
        <h2>Welcome to Teen Patti</h2>
        <div>
          {this.state.user ? (<Cards />) : (<Login/>)}
        </div>
      </div>
    );
  }
}

export default App;