import React from 'react';
import ReactDOM from 'react-dom';
import './Modal.css';

const modalRoot = document.getElementById('modal-root');

class Modal extends React.Component {
	constructor(props){
		super(props);
		this.el = document.createElement('div');
	}

	// Add to HTML doc if Modal is activated
	componentDidMount() {
		modalRoot.appendChild(this.el);
	}

	// Remove from HTML doc if Modal is dismissed
	componentWillUnmount() {
		modalRoot.removeChild(this.el);
	}

	// Portals used for rendering outside of DOM Heirarchy
	render(){
		return ReactDOM.createPortal(this.props.children,this.el)
	}
}

export default Modal;