var path = require("path");

var autoloader = require("./../server/autoloader")
	, config = require("./../config")
	, server = require("./../server")
	, templateEngine = require("./../templating/engine");

var _router = require("./../routing/router");

/**
 * Worker Constructor
 */
function Worker() {
	this.router;
	
	this.root;
	this.settings;
}

/**
 * Starts the worker. Will initialize most of the settings, loads and compiles routes, loads controllers and load the template engines.
 * After initialization will start an http server to handle incoming requests.
 */
Worker.prototype.start = function() {
	console.log("Worker started.");
	console.log("Worker waiting for message from server.");

	process.on('message', function(message) {
		
		this.root = message.root;
		
		console.log("Message received. Let's start the http server for this worker.");

		this.settings = config.loadConfig(this.root);
		
		// Setting up environment
		process.env.NODE_ENV = (typeof process.env.NODE_ENV) !== "undefined" ? process.env.NODE_ENV : this.settings.app.env.dev;

		console.log(process.env.NODE_ENV);
		
		// Load controllers from the controllers directory
		autoloader.loadControllers(path.join(this.root, this.settings.paths.controllers));
		
		// Compile the routes and check if they are valid
		this.router = _router;
		var self = this;
		
		_router.loadRoutes(path.join(this.root, this.settings.paths.routes), function(err) {
			if(typeof err === "undefined") {
				_router.compile(autoloader.controllers);
				
				// Load all template engines.
				templateEngine.loadEngines(self.root);
				
				// Start http server
				server.start(self, self.settings.server.port);
			} else {
				throw Error(err.msg);
			}
		});				
	});
};

module.exports = Worker;