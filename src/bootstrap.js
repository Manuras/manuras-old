/**
 * Entry point of the Manuras Framework test
 */

var autoloader = require("./server/autoloader");
var router = require("./routing/router");
var server = require("./server/server");

var RequestHandler = require("./server/requestHandler");
	
// Compile route file and apply routes

function run(config) {
	
	var routes = {
			home:
				{ 
					route: "/",
					controller: "home:index"
				},
			user: 
				{
					route: "/user/{id}",
					controller: "user:show",
					//defaults: { id: 1 }
				}
	};
	
	autoloader.loadControllers(config.controllers);
	router.compile(autoloader.controllers, routes);
	
	requestHandler = new RequestHandler(router);
	
	server.start(config, requestHandler, 8888);	
}

exports.run = run;

