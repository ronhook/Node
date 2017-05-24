import React from 'react';

class ProfileLogout extends React.Component {
	constructor(props) {
		super(props);
		this.worker	= new Worker('/js/profile.js');
		this.worker.addEventListener('message', this.handleLogout.bind(this));
		this.state = {
			className	: '',
			logTitle	: 'Logging you out',
			paraText	: 'It will be sad to see you go'
		};
		this.doLogout();
	};
	doLogout(){
		this.worker.postMessage({
			action: 'logout'
		});
	};
	handleLogout(e){
		let result = e.data;
		console.log(result);
		if (!result.success) {
			this.setState({
				status: 'failed'
			});
		} else {
			if (result.logout) {
				this.setState({
					status		: 'success',
					logTitle	: 'Bye Bye',
					paraText	: 'Your logout was a success',
					className	: 'success'
				});
				getNav();
			} else {
				this.setState({
					status		: 'fail',
					logTitle	: 'Your logout failed',
					className	: 'fail'
				});
			}
		}
	};
	render(){
		const logClass = 'logout ' + this.state.className;
		return (
			<div className={logClass}>
				<h2>{this.state.logTitle}</h2>
				<p>{this.state.paraText}</p>
			</div>
		);
	};
};


export default ProfileLogout;

window.renderProfileLogout = function(tgt) {
	ReactDOM.render(<ProfileLogout/>, tgt);
}
