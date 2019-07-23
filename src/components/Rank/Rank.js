import React from 'react'

class Rank extends React.Component {

	constructor(){
		super();
		this.state = {
			emoji:''
		}
	}

	componentDidMount() {
		this.generateEmoji(this.props.entries)
	}

	componentDidUpdate(prevProps, prevState) {
		if(prevProps.entries === this.props.entries &&
			prevProps.name === this.props.name){
			return null
		}
		this.generateEmoji(this.props.entries)
	}

	// Emojis listed in array of AWS Lambda function that returns based on entry count
	generateEmoji = (entries) => {
		fetch(`https://jnkm4itq1i.execute-api.us-east-1.amazonaws.com/prod/rank?rank=${entries}`)
		.then(response=>response.json())
		.then(data => this.setState({ emoji: data.input}))
		.catch(console.log)
	}

	render() {
		return (
			<div>
				<div className = 'near-black f3'>
					{`${this.props.name}, the number of photos you've submitted overall is...`}
				</div>
				<div className = 'light-green f1'>
					{this.props.entries}
				</div>
				<div className = 'light-green f3'>
					{`Rank Badge: ${this.state.emoji}`}
				</div>
			</div>
		);
	}
}

export default Rank;