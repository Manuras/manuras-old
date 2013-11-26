/**
 * Entry point of the Manuras Framework
 */

var server = require("./server/server");
var router = require("./routing/router");
var logger = require("./logging/logger");

// Set streams for the Logger
logger.addStream(process.stdout);

// Compile route file and apply routes

var routes = {
		home:
			{ 
				route: "/",
				handler: "home"
			},
		user: 
			{
				route: "/user/{id}/{add}",
				handler: "user",
				//defaults: { id: 1 }
			}
};

router.compile(routes);
server.start(router, 8888, logger);
