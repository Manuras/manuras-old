var path = require('path')
	, log4js = require('log4js');

//TODO: Needs some kind of module support so we can load what we need.

var autoloader = require('./../server/autoloader')
	, config = require('./../config')
	, server = require('./../server')
	, templateEngine = require('./../templating/engine')
	, cache = require('./../cache');

var _router = require('./../routing/router');

var logger = log4js.getLogger('manuras');

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
	logger.info('Worker started.');
	logger.info('Worker waiting for message from server.');

	process.on('message', function(message) {
		
		this.root = message.root;
		
		logger.info('Message received. Let\'s start the http server for this worker.');

		this.settings = config.loadConfig(this.root);
		
		var logFile = this.settings.paths.logfile;
		
		// Setting up logging
		log4js.configure({
			appenders: [
			    { type: 'console' },
			    { type: 'file', filename: logFile }
			]
		});
		
		logger.setLevel(this.settings.logging.level);
		
		// Setting up environment
		process.env.NODE_ENV = (typeof process.env.NODE_ENV) !== 'undefined' ? process.env.NODE_ENV : this.settings.app.env.dev;
		
		// Load controllers from the controllers directory
		autoloader.loadControllers(path.join(this.root, this.settings.paths.controllers));
		
		// Compile the routes and check if they are valid
		this.router = _router;
		var self = this;
		
		_router.loadRoutes(path.join(this.root, this.settings.paths.routes), function(err) {
			if(typeof err === 'undefined') {
				_router.compile(autoloader.controllers);
				
				// Load all template engines.
				templateEngine.loadEngines(self.root);

				// Set up the cache
				cache.init();
				
				// Start http server
				server.start(self, self.settings.server.port);
			} else {
				throw Error(err.msg);
			}
		});				
	});
};

module.exports = Worker;