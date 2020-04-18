import React, { Component } from 'react';
import './App.css';
import fire from './config/Fire'
import Login from './components/Login';
import Cards from './components/Cards';
import teenPattiLogo from './images/logo.png'

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
        <img src={teenPattiLogo} width="200" alt="logo-image"/>
        <br />
        <div>
          {this.state.user ? (<Cards userState={this.state.user} />) : (<Login/>)}
        </div>
      </div>
    );
  }
}

export default App;