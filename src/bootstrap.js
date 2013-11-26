/**
 * Entry point of the Manuras Framework test
 */

var server = require("./server/server");
var router = require("./routing/router");
var handlers = require("./server/handlers");


// Compile route file and apply routes

function run(config) {
	
	var routes = {
			home:
				{ 
					route: "/",
					handler: "home:index"
				},
			user: 
				{
					route: "/user/{id}",
					handler: "user:show",
					//defaults: { id: 1 }
				}
	};

	handlers.loadHandlers(config.handlers);
	router.compile(handlers.handlers, routes);
	
	server.start(config, router, 8888);	
}

exports.run = run;

