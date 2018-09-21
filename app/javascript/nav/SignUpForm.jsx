import React, { Component } from 'react';
import { bind } from 'bind-decorator';

export default class MuttProfilePage extends Component {

	@bind
	onSubmit(e) {
		e.preventDefault();
	    const form = e.nativeEvent.target;
	    const requestData = {
	    	username: form.querySelector(`[name="username"]`).value, 
	    	password: form.querySelector(`[name="password"]`).value,
	    	password_confirmation: form.querySelector(`[name="confirmation"]`).value
	    };

	    fetch(form.action, {
	      headers: {
	        'Accept': 'application/json',
	        'Content-Type': 'application/json'
	      },
	      method: form.method,
	      body: JSON.stringify(requestData)
	    })
	    .then((response) => response.json())
	    .then((data) => {
	      this.props.onSubmit(data);
	    })
	    .catch((error) => {
	      console.error(error)
	    });
	}

	render() {
		return (
			<div className="signup-form">
				<p className="modal-header">Sign Up</p>

				<form className="form"
	              	  method="POST"
	              	  action="/users"
	              	  onSubmit={ this.onSubmit }
	  	    	>
		          	<input type="text"
		                   placeholder="Username"
		                   name="username" />

		            <input type="password"
		                   placeholder="Password"
		                   name="password" />

		            <input type="password"
		                   placeholder="Password Confirmation"
		                   name="confirmation" />

	          		<input type="submit"
	                 	   value="Submit"
	                 	   className="button mutton" />
	        	</form>
			</div>
		);
	}
}
