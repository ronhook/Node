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
		this.refs.email.setValid(this.refs.email.isValid());
		this.refs.password.setValid(this.refs.password.isValid());
		if (this.refs.email.getValue() == '') {
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
	/**
	 * Retursn the current field value
	 * @returns {Boolean}
	 */
	getValue()
	{
		return this.state.value;
	}
	isValid()
	{
		if (this.props.required && !this.state.value) {
			return false;
		}
		return true;
	}
	/**
	 * Sets the valid state
	 * @param {Boolean} val
	 * @returns {Void}
	 */
	setValid(val)
	{
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