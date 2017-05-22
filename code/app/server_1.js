//nodejs.org/api for API docs
//Node.js web server
let http	= require("http"),                           //Import Node.js modules
	url		= require("url"),
	path	= require("path"),
	fs		= require("fs")
	express = require("express");

http.createServer(function(request, response) {
	let name		= url.parse(request.url).pathname;
	let filename	= path.join(process.cwd(), name);        //Create filename
	console.log('Name: ', name);
	console.log('File: ', filename);
	fs.readFile(filename, "binary", function(err, file) { //Read file
		if(err) {                                         //Tracking Errors
			response.writeHead(500, {"Content-Type": "text/plain"});
			response.write(err + "\n");
			console.log(err);
			response.end();
			return;
		}
		response.writeHead(200);                          //Header request response
		response.write(file, "binary");                   //Sends body response
		response.end();                                   //Signals to server that
	});                                                  //header and body sent
}).listen(3000);                                      //Listening port
console.log("Server is listening on port 3000.")      //Terminal output