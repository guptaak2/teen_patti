import React, { Component } from 'react';
import { TextField, Button } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import fire from '../config/Fire';

class Login extends Component {
  constructor(props) {
    super(props);

    this.login = this.login.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.signup = this.signup.bind(this);
    this.state = {
      email: '',
      password: ''
    };
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  login(e) {
    e.preventDefault();
    fire.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then((u) => {
    }).catch((error) => {
      console.log(error);
    });
  }

  signup(e) {
    e.preventDefault();
    fire.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).then((u) => {
    }).then((u) => { console.log(u) })
      .catch((error) => {
        console.log(error);
      })
  }

  render() {
    return (
      <div align="center">
        <div className="Login">
          <form>
            <div class="form-group">
              <label for="exampleInputEmail1">Email address: </label>
              <input value={this.state.email} style={{ marginLeft: '25px', marginBottom: '12px' }} onChange={this.handleChange} type="email" name="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" />
            </div>
            <div class="form-group">
              <label for="exampleInputPassword1">Password: </label>
              <input value={this.state.password} style={{ marginLeft: '54px', marginBottom: '12px' }} onChange={this.handleChange} type="password" name="password" class="form-control" id="exampleInputPassword1" placeholder="Password" />
            </div>
            <button type="submit" onClick={this.login} class="btn btn-primary">Login</button>
            <button onClick={this.signup} style={{ marginLeft: '25px' }} className="btn btn-success">Signup</button>
          </form>
        </div>
      </div>
    )
  }
}

export default Login;