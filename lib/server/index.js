/**
 * Server for the Manuras Framework. Uses Connect to create the app and handle all incoming requests.
 */

var connect = require("connect")
	, domain = require("domain")
	, http = require("http")
	, url = require("url");

var config = require("./../config")
	, requestHandler = require("./requestHandler")
	, errorHandler = require("./errorHandler");

/**
 * Sets up the correct connect middleware and setup a requesthandler to handle incoming request.
 * 
 * @param requestHandler
 * @param port
 * @param root
 */
function start(context, port) {

	var app = connect();
	
	//TODO: Needs to be edited and instead of using config files it should use NODE_ENV
	/*
	if(settings.environment.env === settings.environment.environments.dev) {
		app.use(connect.logger("short"));
	}*/
	
	app.use(connect.static(context.settings.paths.public))
		.use(connect.query())
		.use(connect.cookieParser())
		.use(connect.urlencoded())
		.use(connect.json())
		.use(connect.logger())
	   	.use(requestHandler.handler(context))
		.use(errorHandler.handle());
	
	var server = http.createServer(app);
	
	requestHandler.setServer(server, function() {
		server.listen(port);
	});
}

exports.start = start;