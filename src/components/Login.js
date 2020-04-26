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
		this.writeNewUser = this.writeNewUser.bind(this)
		this.state = {
			firstName: '',
			email: '',
			password: '',
			emailHelperText: 'Please enter your email',
			passwordHelperText: 'Please enter your password',
			emailError: false,
			passwordError: false
		};
	}

	login(e) {
		e.preventDefault();
		fire.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then((u) => {
			fire.database().ref('users/list/' + fire.auth().currentUser.uid).set({
				email: this.state.email,
				name: this.state.firstName,
				isLoggedIn: true,
				status: 'BLIND',
				showCardsMessage: ''
			});
			this.setState({
				emailError: false,
				emailHelperText: 'Please enter your email',
				passwordError: false,
				passwordHelperText: 'Please enter your password'
			})
		}).catch((error) => {
			console.log(error);
			if (error.code == 'auth/wrong-password') {
				this.setState({
					emailError: false,
					emailHelperText: 'Please enter your email',
					passwordHelperText: "Incorrect password. Please try again",
					passwordError: true
				})
			} else if (error.code == 'auth/invalid-email') {
				this.setState({
					emailHelperText: "Invalid email. Please try again",
					emailError: true,
					passwordError: false,
					passwordHelperText: 'Please enter your password'
				})
			} else if (error.code == 'auth/user-not-found') {
				this.setState({
					emailHelperText: "This user does not exist. Please signup.",
					emailError: true,
					passwordError: false,
					passwordHelperText: 'Please enter your password'
				})
			}
		});
	}

	signup(e) {
		e.preventDefault();
		fire.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).then((u) => {
			if (u.user) {
				this.setState({
					emailError: false,
					emailHelperText: 'Please enter your email',
					passwordError: false,
					passwordHelperText: 'Please enter your password'
				})
				u.user.updateProfile({
					displayName: this.state.firstName
				})
				this.writeNewUser()
			}
		}).catch((error) => {
			console.log(error);
			if (error.code == 'auth/weak-password') {
				this.setState({
					emailError: false,
					emailHelperText: 'Please enter your email',
					passwordError: true,
					passwordHelperText: 'Password should be at least 6 characters'
				})
			}
		})
	}

	writeNewUser() {
		var userId = fire.auth().currentUser.uid;
		var updates = {};
		updates['users/list/' + userId] = userId;
		fire.database().ref().update(updates);
		fire.database().ref('users/list/' + userId).set({
			email: this.state.email,
			name: this.state.firstName,
			isLoggedIn: true,
			status: 'BLIND',
			showCardsMessage: ''
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
							<TextField id="email" label="Email" value={this.state.email} onChange={this.handleEmailFieldChange} helperText={this.state.emailHelperText} error={this.state.emailError ? true : false} />
						</Box>
						<br />
						<Box>
							<TextField id="password" type="password" label="Password" value={this.state.password} onChange={this.handlePasswordFieldChange} helperText={this.state.passwordHelperText} error={this.state.passwordError ? true : false} />
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