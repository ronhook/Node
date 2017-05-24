import React			from 'react';
import {render}			from 'react-dom';
import AwesomeComponent from './component.jsx';
import ProfileLogin		from './profile_login.jsx';
import ProfileLogout	from './profile_logout.jsx';

class App extends React.Component {
  render () {
    return (
		<div>
			<p> Hello React!</p>
			<AwesomeComponent />
			<ProfileLogin/>
		</div>
	);
  }
}

