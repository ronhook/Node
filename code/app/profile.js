exports.createProfile = function(){
	return new Profile();
};


class Profile{
	isLoggedIn (req) {
		return req.session.loggedIn;
	}
	doPostRoute (req) {
		const route		= req.params;
		const action	= route[0];
		let ses			= req.session;
		switch (action) {
			case 'login':
				if (req.body.email.toLowerCase() == 'anyone@fromanywhere.com' && req.body.password == 'let me in') {
					ses.loggedIn = true;
					return {
						login: true
					};
				}
				return {
					login: false
				};
				break;
			case 'logout':
				ses.loggedIn = false;
				return {
					logout: true
				};
				break;
		}
	}
}
