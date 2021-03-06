import React from 'react'
import './SignIn.css';

class SignIn extends React.Component {


	constructor(props){
		super(props);
		this.state = {
			signInEmail: '',
			signInPassword: '',
			isInvalid: false
		}
	}

	handleKeyPress = (event) => {
	  if(event.key === 'Enter'){
	    this.onSubmitSignIn()
	  }
	}

	onEmailChange = (event) => {
		this.setState({signInEmail: event.target.value})
	}

	onPasswordChange = (event) => {
		this.setState({signInPassword: event.target.value})
	}

	saveAuthTokenInSession = (token) => {
		window.sessionStorage.setItem('token', token)
	}

	// Sends fetch request on remote Heroku server running Express.js backend
	onSubmitSignIn = () => {

		fetch('https://morning-woodland-38355.herokuapp.com/signin', {
			method: 'post',
			headers: {'Content-Type':'application/json'},
			body: JSON.stringify({
				email: this.state.signInEmail,
				password: this.state.signInPassword
			})
		})
		.then(response => response.json())
		.then(data => {
			if (data.userId && data.success === 'true'){
				this.setState({isInvalid: false});
				this.saveAuthTokenInSession(data.token);
		        fetch(`https://morning-woodland-38355.herokuapp.com/profile/${data.userId}`, {
		          	  method: 'get',
			            headers: {
			              'Content-Type': 'application/json',
			              'Authorization': data.token
            			}
   				})
	        	.then(resp => resp.json())
	          	.then(user => {
	            	if (user && user.email){
	              		this.props.loadUser(user);
	             	 	this.props.onRouteChange('home');
	            	}
	          	})
		        .catch(console.log)
		    } else{ this.setState({isInvalid: true})}
		})	
	}


	onSubmitTest = async() => {
		await this.setState({signInEmail: 'test@test.com', signInPassword:'test'});
		this.onSubmitSignIn();
	}

	render(){

		return (
		<article className="br3 ba dark-gray b--black-10 mv1 w-100 w-50-m w-25-l mw6 shadow-5 center bg-white-40">
			<main className="pa3 black-80">
			  <div className="measure">
			    <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
			      <legend className="f1 fw6 ph0 mh0 sign-in-text">Sign In</legend>
			      <div className="mt3">
			        <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
			        <input 
			        	className="b--black pa2 input-reset ba bg-transparent hover-black w-100 hover-bg-white" 
			        	type="email" 
			        	name="email-address"  
			        	id="email-address"
			        	onChange={this.onEmailChange}
			        	onKeyPress={this.handleKeyPress}
			        />
			      </div>
			      <div className="mv3">
			        <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
			        <input 
			        	className="b--black pa2 input-reset ba bg-transparent hover-black w-100 hover-bg-white" 
			        	type="password" 
			        	name="password"  
			        	id="password" 
			        	onChange={this.onPasswordChange}
			        	onKeyPress={this.handleKeyPress}
			        />
			      </div>
			    </fieldset>

			    { this.state.isInvalid &&
			    	<div className="f6 red mv3"> Invalid Credentials </div>
			    }

			    <div className="">
			      <input
			      		onClick = {this.onSubmitSignIn}
			      		className="b--black ph3 pv2 mh1 input-reset ba bg-transparent grow pointer f6 dib hover-black hover-bg-white" 
			      		type="submit"
			      		value="Sign in" />
			      <input 
			      		onClick = {this.onSubmitTest}
			      		className="b--black ph3 pv2 mh1 input-reset ba bg-transparent grow pointer f6 dib hover-black hover-bg-white" 
			      		type="submit"
			      		value="Test" />
			    </div>
			  </div>
			</main>
		</article>
		);
	}
}

export default SignIn;