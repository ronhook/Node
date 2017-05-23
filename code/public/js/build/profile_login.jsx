import React from 'react';

class ProfileLogin extends React.Component {
	constructor(props) {
		super(props);
		this.handleSubmit	= this.handleSubmit.bind(this);
		this.handleChange	= this.handleChange.bind(this);
		this.worker			= new Worker('/js/profile.js');
		this.worker.addEventListener('message', this.doLogin.bind(this));
		this.state = {
			email			: false,
			password		: false,
			invalidEmail	: false,
			className		: 'login'
		};
	}
	doLogin(e){
		let result = e.data;
		console.log(result);
		if (!result.success) {
			console.log('There was an error');
		} else {
			console.log('all good');
		}
	};
	handleSubmit (e) {
		e.preventDefault();
		//console.log('value:', this.refs.email.value, this.refs.email.valid);
		this.refs.email.valid		= this.refs.email.valid;
		this.refs.password.valid	= this.refs.password.valid;
		if (!this.refs.email.valid || !this.refs.password.valid) {
			this.invalidEmail = true;
			this.setState({
				className: 'login invalid'
			});
			return;
		}
		this.worker.postMessage({
			action		: 'login',
			values		: {
				email		: this.refs.email.value,
				password	: this.refs.password.value
			}
		});
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
				<EmailInput
					label="Email"
					required={true}
					ref="email"
					onChange={this.handleChange.bind(this)}
				/>
				<PasswordInput
					label="Password"
					ref="password"
					required={true}
				/>
				<p className="center">
					<button>Start the fun</button>
				</p>
			</form>
		);
	}
};

class FormInput extends React.Component{
	constructor(props) {
		super(props);
		this.type = 'text';
		this.state = {
			value	: '',
			valid	: props.valid === undefined ? true : props.valid
		};
	}
	get value() {
		return this.state.value;
	};
	get valid() {
		if (this.props.required && !this.state.value) {
			return false;
		}
		return true;
	}
	set valid (val)	{
		this.setState({
			valid: val
		});
	}
	/**
	 * Handles input value changes
	 * @param {Event} e
	 * @returns {Void}
	 */
	handleChange(e){
		this.setState({
			value: e.target.value
		});
		if (this.props.onChange) {
			this.props.onChange(e.target.value);
		}
	}
	/**
	 * Renders the field
	 * @returns {String|FormInput.props.type|Boolean}
	 */
	render(){
		return (
			<label className={this.state.valid ? 'valid' : 'invalid'}>
				<div>
					{this.props.label &&
						<span>{this.props.label}</span>
					}
					<input type={this.type} onChange={this.handleChange.bind(this)} />
				</div>
			</label>
		);
	}
};

class EmailInput extends FormInput{
	constructor(props) {
		super(props);
		this.type = 'email';
	}
};

class PasswordInput extends FormInput{
	constructor(props) {
		super(props);
		this.type = 'password';
	}
};

export default ProfileLogin;

window.renderProfileLogin = function(tgt) {
	ReactDOM.render(<ProfileLogin/>, tgt);
}