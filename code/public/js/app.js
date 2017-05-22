
let worker = new Worker('/js/worker.js?v=1');

worker.addEventListener('message', function(e) {
	let result = e.data;
	//console.log('Result: ', result);
	if (!result.success) {
		console.log('There was an error');
	} else {
		//console.log(e.data);
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
	worker.postMessage({
		uri: '/nav',
		method: 'get'
	});

	static_worker.postMessage({
		url: "/images/dots.png"
	});

	//console.log(location.hash);
	if (location.hash) {
		pageRouter();
	}
}

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

pageRouter = function() {
	let hash = location.hash;

	if (hash) {
		let args = hash.slice(1).split('/');
		let route = args.shift();
		//console.log(route, args);
		//console.log('Route: ', route);
		switch (route) {
			case 'login':
				openLogin(args)
				break;
			case 'views':
				viewsPage(args)
				break;
		}
	} else {
		homePage();
		//console.log('Gone home for the day...');
	}
}

window.onhashchange = pageRouter;

function viewsPage() {
	Q.select('.page-body').html('<p>Views</p><pre>' + JSON.stringify(arguments)) + '</pre>';
}
function homePage() {
	history.pushState({path: '/'}, 'Home', '/');
	Q.select('h1').text('Home');
	Q.select('.page-body').html('<p>Home</p>');
	//history.pushState({path: '/'}, 'Home', '/');
}

function openLogin() {
	Q.select('h1').text('Login');
	renderProfileLogin(document.getElementById('page-body'));
	//history.pushState({path: '#login'}, 'Login', '#login');
}
