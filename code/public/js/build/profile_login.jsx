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
			className		: '',
			status			: 'entry',
			buttonText		: 'Start the fun',
			formTitle		: 'Enter your login details',
			defaultEmail	: 'anyone@fromanywhere.com',
			defaultPassword : 'let me in'
		};
	}
	copyUser (e) {
		e.preventDefault();
		this.refs.email.value		= this.state.defaultEmail;
		this.refs.password.value	= this.state.defaultPassword;
	}
	doLogin(e){
		let result = e.data;
		if (!result.success) {
			this.setState({
				status: 'failed'
			});
		} else {
			if (result.login) {
				this.setState({
					status		: 'success',
					formTitle	: 'Your login was a success',
					className	: 'success'
				});
				getNav();
			} else {
				this.setState({
					status		: 'fail',
					formTitle	: 'Your login failed',
					className	: 'fail',
					buttonText	: 'Try again'
				});
			}
		}
	};
	handleSubmit (e) {
		e.preventDefault();
		if (this.state.status == 'posting') {
			this.setState({
				buttonText: 'Already sending login details'
			});
			return;
		}
		//console.log('value:', this.refs.email.value, this.refs.email.valid);
		this.refs.email.setValid();
		this.refs.password.setValid();
		if (!this.refs.email.valid || !this.refs.password.valid) {
			this.invalidEmail = true;
			this.setState({
				className: 'invalid'
			});
			return;
		}
		this.setState({
			status		: 'posting',
			buttonText	: 'Checking your credentials'
		});
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
		const instrClass	= 'instructions ' + (this.state.status == 'success' ? 'hidden' : '');
		const formClass		= 'login ' + this.state.className;
		//console.log(this.state.classList);
		return (
			<div className="log-window">
				<form className={formClass} onSubmit={this.handleSubmit}>
					<h2><div>{this.state.formTitle}</div></h2>
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
						<button>{this.state.buttonText}</button>
					</p>
				</form>
				<div className={instrClass}>
					<div className="float-box left">Use	"<code>{this.state.defaultEmail}</code>" and "<code>{this.state.defaultPassword}</code>" for the password.</div>
					<a className="float-box right" onClick={this.copyUser.bind(this)} href="">Paste into form</a>
					<div className="clear"></div>
				</div>
			</div>
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
	set value(val) {
		this.setState({
			value: val
		});
	}
	get valid() {
		if (this.props.required && !this.state.value) {
			return false;
		}
		return true;
	}
	setValid ()	{
		this.setState({
			valid: this.valid
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
					<input type={this.type} value={this.state.value} onChange={this.handleChange.bind(this)} />
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