import React, { Component } from 'react';
import { TextField, Button } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import fire from '../config/Fire';

var cards = [];

class Login extends Component {
	constructor(props) {
		super(props);
		
		this.login = this.login.bind(this);
		this.signup = this.signup.bind(this);
		this.handleEmailFieldChange = this.handleEmailFieldChange.bind(this)
		this.handlePasswordFieldChange = this.handlePasswordFieldChange.bind(this)
		this.handleFirstNameFieldChange = this.handleFirstNameFieldChange.bind(this)
		this.getUserData = this.getUserData.bind(this)
		this.writeNewUser = this.writeNewUser.bind(this)
		this.state = {
			firstName: '',
			email: '',
			password: '',
		};
	}
	
	componentDidMount() {
		// GET CARDS BRO
		const dbRef = fire.database().ref().child('cards')
		dbRef.on('value', snap => {
			snap.val().forEach((card) => {
				cards.push({
					suit: card.suit,
					card: card.card
				});
			})
			cards.forEach((card) => {
				console.log("Suit: " + card.suit + " Card: " + card.card)
			})
		})
	}
	
	getUserData() {
		var userId = fire.auth().currentUser.uid;
		console.log(userId)
		return fire.database().ref('users/list/' + userId).once('value').then(function (snapshot) {
			var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
			console.log(username)
		});
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
			this.writeNewUser()
		}).catch((error) => {
			console.log(error);
		})
	}
	
	writeNewUser() {
		var userId = fire.auth().currentUser.uid;
		var updates = {};
		updates['users/list/' + userId] = userId;
		fire.database().ref().update(updates);
		fire.database().ref('users/list/' + userId).set({
			email: this.state.email,
			name: this.state.firstName
		}, function (error) {
			if (error) {
				console.log("User save error")
			} else {
				console.log("User saved successfully")
			}
		});
	}
	
	handleEmailFieldChange(e) {
		e.preventDefault()
		this.setState({
			email: e.target.value
		})
	}
	
	handlePasswordFieldChange(e) {
		e.preventDefault()
		this.setState({
			password: e.target.value
		})
	}
	
	handleFirstNameFieldChange(e) {
		e.preventDefault()
		this.setState({
			firstName: e.target.value
		})
	}
	
	render() {
		return (
			<div align="center">
			<div className="Login">
			<form>
			<Box>
			<TextField id="firstName" label="First name (lowercase)" value={this.state.firstName} onChange={this.handleFirstNameFieldChange} helperText="Please enter your first name" />
			</Box>
			<Box>
			<TextField id="email" label="Email" value={this.state.email} onChange={this.handleEmailFieldChange} helperText="Please enter your email" />
			</Box>
			<br />
			<Box>
			<TextField id="password" type="password" label="Password" value={this.state.password} onChange={this.handlePasswordFieldChange} helperText="Please enter your password" />
			</Box>
			<Box m={2} pt={3}>
			<Button variant="contained" color="primary" onClick={this.login.bind(this)} >LOGIN</Button>
			</Box>
			<Box>
			<Button className="btn btn-success" variant="contained" color="primary" onClick={this.signup.bind(this)} >SIGN UP</Button>
			</Box>
			</form>
			</div>
			</div>
			)
		}
	}
	
	export default Login;