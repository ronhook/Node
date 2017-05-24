exports.createNav = function(){
	return new Nav();
};

Nav = function(){
	this.exec = function(req){
		let ses = req.session;
		if (ses.views) {
			ses.views++;
		} else {
			ses.views = 1;
		}

		let nav = {
			home	: this.button('home', ''),
			views	: this.button('views (' + req.session.views + ')', 'views/' + req.session.views)
		};
		if (ses.loggedIn) {
			nav.profile = this.button('profile', 'profile');
			nav.logout = this.button('log out', 'logout');
		} else {
			nav.login = this.button('log in', 'login');
		}
		return nav;
	};
	this.button = function(title, uri){
		return {
			title: title,
			uri: uri
		};
	}
};