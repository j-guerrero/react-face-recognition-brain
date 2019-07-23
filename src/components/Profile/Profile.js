import React, { Component } from 'react';
import Avatar from 'react-avatar';
import './Profile.css';

class Profile extends Component {

	// Can add any state properties of user to be displayed
	constructor(props) {
		super(props);
		this.state = {
			name: this.props.user.name,
			entries: this.props.user.entries,
			joined: this.props.user.joined,

		}
	}

	onFormChange = (event) => {
		switch(event.target.name){
			case 'user-name':
				this.setState({name: event.target.value})
				break;
			default:
				return;
		}
	}

	// Updates info fields in POSTGRES database of {user.id}
	onProfileUpdate = (data) => {
		fetch(`https://morning-woodland-38355.herokuapp.com/profile/${this.props.user.id}`, {
			method: 'post',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': window.sessionStorage.getItem('token')
			},
			body: JSON.stringify({ formInput: data})
		}).then(resp => {
			if(resp.status === 200 || resp.status === 304){
				this.props.toggleModal();
				this.props.loadUser({...this.props.user, ...data})
			}
		}).catch(console.log);
	}

	render(){
		const { toggleModal } = this.props;
		const { name, age, pet, entries } = this.state;	
		return (
			<div
				className="profile-modal">
				<article className="br3 ba dark-gray b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center bg-white">
					<main className="pa4 black-80 w-80">
					<div style={{display: 'flex', justifyContent:'space-between'}}>
						<Avatar name={name} size="75" round={true}/>
					   	<div className='modal-close' onClick={toggleModal}>&times;</div>
					</div>
					   	<h1>{name}</h1>
					   	<hr />
						<p>Member Since: 22 September, TA 2890 (SR 1290)</p>
					    <h4>Images Submitted: {entries}</h4>
					    <hr />
					    <h4 className="tc gray"> Settings </h4>
					    <label className="mt2 fw6" htmlFor="user-name">Change Profile Name:</label>
				      	<input
				      		onChange={this.onFormChange} 
				        	className="b--black pa2 ba w-100"
				        	placeholder="Enter new profile name"
				        	type="text" 
				        	name="user-name"  
				        	id="name"
				       	/>
				       	<div className='mt4' style={{display: 'flex', justifyContent:'space-evenly'}}>
				       		<button 
				       			onClick={() => this.onProfileUpdate({name, age, pet})}
				       			className='b pa2 grow pointer hover-white w-40 bg-light-blue b--black-20'>
				       			Save
				       		</button>
				       		<button className='b pa2 grow pointer hover-white w-40 bg-light-red b--black-20'
				       		onClick={toggleModal}>
				       			Cancel
				       		</button>
				       	</div>
					</main>

				</article>
			</div>
		)		
	}

}

export default Profile;