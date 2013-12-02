/**
 * Entry point of the Manuras Framework test
 */

var path = require("path");

var autoloader = require("./server/autoloader")
	, config = require("./config")
	, router = require("./routing/router")
	, server = require("./server/server");

var RequestHandler = require("./server/requestHandler");

// Compile route file and apply routes

function run(root) {
	
	var routes = {
			home:
				{ 
					route: "/",
					controller: "home:index"
				},
			user: 
				{
					route: "/user/{id}/{action}",
					controller: "user:show",
					//defaults: { id: 1 }
				}
	};
	
	settings = config.loadConfig(root);

	autoloader.loadControllers(path.join(root, settings.paths.controllers));
	router.compile(autoloader.controllers, routes);
	
	requestHandler = new RequestHandler(router);
	
	server.start(requestHandler, settings.server.port, root);
}

exports.run = run;

