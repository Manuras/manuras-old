/**
 * Entry point of the Manuras Framework test
 */

var path = require("path");

var autoloader = require("./server/autoloader")
	, config = require("./config")
	, router = require("./routing/router")
	, server = require("./server")
	, templateEngine = require("./templating/engine");

var RequestHandler = require("./server/requestHandler");


/**
 * Bootstraps the Manuras Framework. Will first load required information and after that start a new server.
 * This file also provides the interface for the user of the framework to use.
 * 
 * @param root
 */
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
				},
			ejs:
				{
					route: "/ejs",
					controller: "templateEngines:ejs"
				},
			jade:
				{
					route: "/jade",
					controller: "templateEngines:jade"
				},
			mustache:
				{
					route: "/mustache",
					controller: "templateEngines:mustache"
				},
			underscore:
				{
					route: "/underscore",
					controller: "templateEngines:underscore"
				}
	};
	
	settings = config.loadConfig(root);

	autoloader.loadControllers(path.join(root, settings.paths.controllers));
	router.compile(autoloader.controllers, routes);
	
	templateEngine.loadEngines(root);
	
	requestHandler = new RequestHandler(router);
	
	server.start(requestHandler, settings.server.port, root);
}

exports.run = run;

// Interfaces for user
exports.View = require("./mvc/view");
exports.config = require("./config");

