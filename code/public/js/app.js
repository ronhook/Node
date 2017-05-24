// Load the navigation
let worker = new Worker('/js/worker.js?v=1');
worker.addEventListener('message', function(e) {
	let result = e.data;
	if (!result.success) {
		console.log('There was an error');
	} else {
		let html = "<ul>", link;
		for (let button in e.data.nav) {
			link = e.data.nav[button].uri ? '#' + e.data.nav[button].uri : '';
			html += "<li><a class=\"" + button + "\" href=\"/" + link + "\">" + e.data.nav[button].title + "</li>"
		}
		html += "</ul>";
		Q.select("nav").html(html);
		Q.select("a").on("click", doRoute);

	}
});

// Load the background image
let static_worker = new Worker('/js/static.js');
static_worker.addEventListener('message', function(e) {
	let result = e.data;
	if (!result.success) {
		console.log('There was an error loading the image');
	} else {
		Q.select("body").css('background-image', 'url(data:image/png;' + result.image + ')');
	}
});

window.onload = function() {
	Q = new Query();
	Q.select("nav li").on("click", function(node){
		window.location = Q.select(this).find("a").prop("href");
	});

	getNav();

	static_worker.postMessage({
		url: "/images/dots.png"
	});

	//if (location.hash) {
		pageRouter();
	//}
}

function getNav(){
	worker.postMessage({
		uri: '/nav',
		method: 'get'
	});
}

// trigger the page view
function doRoute(e){
	let target = Q.select(e.target);
	let hash = location.hash;
	//console.log({hash: hash, href: target.prop("href")});
	if (target.prop("href") == hash) {
		pageRouter();
	}
	//console.log(target.prop("href"));
	if (target.prop("href") == '/') {
		e.preventDefault();
		homePage();
	}
}

// initiates a page view
pageRouter = function() {
	let hash = location.hash;
	if (hash) {
		// get the top level route
		let args = hash.slice(1).split('/');
		let route = args.shift();
		switch (route) {
			case 'login':
				openLogin(args)
				break;
			case 'views':
				viewsPage(args)
				break;
			case 'profile':
				viewProfile(args);
				break;
			case 'logout':
				doLogout(args);
				break;
		}
	} else {
		homePage();
	}
}

window.onhashchange = pageRouter;

// open the profile page view
function viewProfile(){
	// :TODO: check login status
	Q.select('h1').text('Profile');
	Q.select('.page-body').html('<h2>You know who you are</h2><p>I don\'t have describe you to yourself</p>');
	document.title = 'Profile';
}

// open the views page view (shows full page laod cont in session)
function viewsPage(views) {
	Q.select('h1').text('Views');
	Q.select('.page-body').html('<h2>Tracking your every move...</h2><p>You have opened this page ' + views + ' times this session.</p>');
	document.title = 'Views (' + views + ')';
}

// open the home page view
function homePage() {
	history.pushState({path: '/'}, 'Home', '/');
	Q.select('h1').text('Home');
	Q.select('.page-body').html('<h2>Home is where the heart is</h2><p>If you\'re an Egyptian mummy, that means it\'s in a small jar, buried under 2,000 years of sand, and trodden over by camels and tourists.</p>');
	document.title = 'Node';
}

// open the login view
function openLogin() {
	// :TODO: check login status
	Q.select('h1').text('Login');
	renderProfileLogin(document.getElementById('page-body'));
	document.title = 'Log In';
}

// log out of the app
function doLogout() {
	// :TODO: check login status
	Q.select('h1').text('Log Out');
	renderProfileLogout(document.getElementById('page-body'));
	document.title = 'Log Out';
}
