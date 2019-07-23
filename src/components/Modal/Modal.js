import React from 'react';
import ReactDOM from 'react-dom';
import './Modal.css';

const modalRoot = document.getElementById('modal-root');

class Modal extends React.Component {
	constructor(props){
		super(props);
		this.el = document.createElement('div');
	}

	// Add to HTML doc if active
	componentDidMount() {
		modalRoot.appendChild(this.el);
	}

	// Remove from HTML ...
	componentWillUnmount() {
		modalRoot.removeChild(this.el);
	}

	render(){
		return ReactDOM.createPortal(this.props.children,this.el)
	}
}

export default Modal;