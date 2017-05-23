let express = require("express");
let app		= express();
let router	= express.Router();
let session = require("express-session");
let secret	= 'fdsfdsfdsfds fdsfdsf dsf dsw4564356tr4egtrefgdf';
let bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));
let hour	= 3600000;

router.use(function(req, res, next) {
	console.log("method: " + req.method);
	next();
});

router.get("/", function(req, res) {
	res.json({message: "hiya Ron"});
});

router.post("/", function(req, res) {
	res.json({message: "hiya Ron"});
});

router.get("/nav/", function(req, res){
	//console.log("method: " + req.method);
	let nav = require('./nav');
	let handler = nav.createNav();
	res.json({nav: handler.exec(req)});
});

router.get("/profile/*", function(req, res){
	//let nav = require("./profile");
	//let handler = nav.createNav();
	res.json({login: 2, id: "dsffds7fsd9"});
});

router.post("/profile/*", function(req, res){
	//let nav = require("./profile");
	//let handler = nav.createNav();
	res.json({
		login	: true,
		id		: "dsffds7fsd9",
		email	: req.body.email,
		password	: req.body.password,
		money	: 56
	});
});

router.get("*", function(req, res){
	res.status(404).send("Route not supported");
});

router.post("*", function(req, res){
	res.status(404).send("Route poster not supported");
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
