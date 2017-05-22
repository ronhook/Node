import React from 'react';

class ProfileLogin extends React.Component {
	constructor(props) {
		super(props);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.state = {
			email			: false,
			password		: false,
			invalidEmail	: false,
			className		: 'login'
		};
	}
	handleSubmit (e) {
		e.preventDefault();
		this.refs.email.setValid(this.refs.email.getValue() != '');
		this.refs.password.setValid(this.refs.password.getValue() != '');
		if (this.refs.email.getValue() == '') {
			console.log('no good');
			this.invalidEmail = true;
			this.setState({
				className: 'login invalid'
			});
		}
	}
	handleChange(value) {
		this.setState({
			value: value
		});
	}

	render () {
		const invalidEmail = true;
		//console.log(this.state.classList);
		return (
			<form className={this.state.className} onSubmit={this.handleSubmit}>
				<h2>Enter your login details</h2>
				<FormInput
					label="Email"
					type="email"
					required={true}
					ref="email"
					onChange={this.handleChange.bind(this)}
				/>
				<FormInput
					label="Password"
					ref="password"
					required={true}
					type="password"
				/>
				<p>
					<button>Submit</button>
				</p>
			</form>
		);
	}
};

class FormInput extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			value: '',
			valid: props.valid === undefined ? true : props.valid
		};
	}
	getValue()
	{
		return this.state.value;
	}
	setValid(val)
	{
		console.log('aha');
		this.setState({
			valid: val
		});
	}
	handleChange(e){
		this.setState({
			value: e.target.value
		});
		if (this.props.onChange) {
			this.props.onChange(e.target.value);
		}
	}
	render(){
		console.log(this.props.label, this.state);
		return (
			<label className={this.state.valid ? 'valid' : 'invalid'}>
				<div>
					{this.props.label &&
						<span>{this.props.label}</span>
					}
					<input type={this.props.type || 'text'} onChange={this.handleChange.bind(this)} />
				</div>
			</label>
		);
	}
};

export default ProfileLogin;

window.renderProfileLogin = function(tgt) {
	ReactDOM.render(<ProfileLogin/>, tgt);
}