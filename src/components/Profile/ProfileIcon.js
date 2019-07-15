import React, { Component } from 'react';
import Avatar from 'react-avatar';
import {	Dropdown,
			DropdownToggle,
		 	DropdownMenu,
		 	DropdownItem
		} from 'reactstrap';

class ProfileIcon extends Component {
	constructor(props){
		super(props);
		this.toggle = this.toggle.bind(this);
		this.state = {
			name: this.props.user.name,
			dropdownOpen: false
		}
	}

	toggle = () => {
	    this.setState(prevState => ({
	      dropdownOpen: !prevState.dropdownOpen
	    }));
	  }

	render(){
		return(
			<div className="pa4 tc">
			<Dropdown
				isOpen={this.state.dropdownOpen} 
				toggle={this.toggle}
			>
		        <DropdownToggle
		          tag="span"
		          data-toggle="dropdown"
		          aria-expanded={this.state.dropdownOpen}
		        >
				<Avatar name={this.state.name} size="75" round={true}/>
		        </DropdownToggle>
		        <DropdownMenu right
		        	className='b--transparent shadow-5 o-90 mt4' 
		        >
		          <DropdownItem onClick={this.props.toggleModal}>View Profile</DropdownItem>
		          <DropdownItem onClick={() => this.props.onRouteChange('sign-out')}>Sign Out</DropdownItem>
		        </DropdownMenu>
		      </Dropdown>

			
			</div>
		);
	}
}

export default ProfileIcon;