/**
 * Server for the Manuras Framework. Uses Connect to create the app and handle all incoming requests.
 */
var connect = require("connect");

var http = require("http");
var url = require("url");

function start(manuras, router, port) {
	
	var app = connect();
	
	if(manuras.environment === manuras.environments["dev"]) {
		app.use(connect.logger("short"));
	}
			
	app.use(connect.static(manuras.public))
	   	.use(function(request, response, next) {
			var pathname = url.parse(request.url).pathname;
			router.handle(pathname, request, response);
	});
	
	
	http.createServer(app).listen(port);
	console.log("Server has started on port: " + port);
}

exports.start = start;