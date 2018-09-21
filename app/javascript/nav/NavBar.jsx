import React, { Component } from 'react';
import { bind } from 'bind-decorator';
import Modal from '../ui/Modal';
import LogInForm from './LogInForm.jsx';
import SignUpForm from './SignUpForm.jsx';

export default class MuttProfilePage extends Component {

	constructor(props) {
		super(props);
		this.state = {
			loggedIn: props.loggedIn,
			currentUser: props.currentUser,
			logInModalActive: false,
			signUpModalActive: false,
			errorMessage: null
		};
	}

	@bind
  	openLogInModal() {
	    this.setState({ logInModalActive: true, errorMessage: null });
    }

    @bind
    openSignUpModal() {
  		this.setState({ signUpModalActive: true, errorMessage: null });
  	}

  	@bind
  	closeModal() {
    	this.setState({ logInModalActive: false, signUpModalActive: false });
  	}

  	@bind
  	onLoggedIn(data) {
  		if (data && data.id !== undefined) {
  			this.setState({ loggedIn: true, currentUser: data, errorMessage: null });
  		} else {
  			const message = `Error - Unable to resolve user: ${Object.keys(data).map(issue => issue + " " + data[issue])}`;
  			console.warn(message);
  			this.setState({ errorMessage: message });
  		}

  		this.closeModal();
  	}

	render() {
		const { loggedIn, currentUser, logInModalActive, signUpModalActive, errorMessage } = this.state;

		const links = [
			<a key="home-link" className="nav-link" href="/">Home</a>
		];

		if (loggedIn) {
			links.push(<a key="profile-link" className="nav-link" href={ `/users/${currentUser.id}` }>Profile</a>);
			links.push(<a key="logout-link" className="nav-link" href="/logout">Log Out</a>);
		} else {
			links.push(<a key="login-link" className="nav-link" href="#" onClick={ this.openLogInModal }>Log In</a>);
			links.push(<a key="signup-link" className="nav-link" href="#" onClick={ this.openSignUpModal }>Sign Up</a>);
		}

		const errorMessageDisplay = errorMessage ? <div className="error-message">{ errorMessage }</div> : undefined;

		return (
			<div className="nav-bar">
				<div className="nav-background"/>
					<div className="nav-content">
					<div className="muttwhat">
						<a href="/">muttwhat</a>
					</div>
					<div className="nav-link-list">
						{ links }
					</div>
					{ errorMessageDisplay }
				</div>

				<Modal isActive={ logInModalActive } closeModal={ this.closeModal }>
					<LogInForm onSubmit={ this.onLoggedIn } />
				</Modal>

				<Modal isActive={ signUpModalActive } closeModal={ this.closeModal }>
					<SignUpForm onSubmit={ this.onLoggedIn } />
				</Modal>
			</div>
		);
	}
}
