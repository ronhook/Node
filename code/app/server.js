let express = require("express");
let app		= express();
let router	= express.Router();
let session = require("express-session");
let secret	= 'fdsfdsfdsfds fdsfdsf dsf dsw4564356tr4egtrefgdf';
let hour	= 3600000;

router.use(function(req, res, next) {
	//console.log("method: " + req.method);
	next();
});

router.get("/", function(req, res) {
	res.json({message: "hiya Ron"});
});

router.get("/nav/", function(req, res){
	//console.log("method: " + req.method);
	let nav = require('./nav');
	let handler = nav.createNav();
	res.json({nav: handler.exec(req)});
});

router.get("*", function(req, res){
	res.status(404).send("Route not supported");
});

app.use(session({
	cookieName			: 'session',
	secret				: secret,
	proxy				: true,
	resave				: true,
	saveUninitialized	: true,
	cookie				: {
		maxAge	: hour
	}
}));

app.use("/", router);

app.listen(3000, function(){
	console.log("Server is listening on port 3000.");
});
