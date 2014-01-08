var async = require('async')
	, domain = require('domain')
	, log4js = require('log4js')
	, url = require('url');

var Request = require('./context/request')
	, Response = require('./context/response')
	, Controller = require('./../mvc/controller')
	, BaseSession = require('./../session/basesession')
	, NotFoundError = require('./../errors/notfound');

var s = undefined;
var logger = log4js.getLogger('manuras');

/**
 * Handles all incoming requests that weren't handled by the previous connect middleware.
 * 
 * @param settings
 * @returns {Function}
 */
function handler(context) {	
	return function(req, res, next) {
		// Setup domain for error handeling of a request. Request Domain.
		var d = domain.create();
		
		// On error send the error to the error handler.
		d.on('error', function(err) {
			next({context: context, server: s, error: err});
		});
	
		// Add request and response objects from the http server to the domain
		d.add(req);
		d.add(res);
		
		// Handle request inside the domain.
		d.run(function() {
			
			// Set Timeout otherwise domain doesn't work. I suspect we need a async call in order to make the domain work.
			setTimeout(function() {	
				var uri = url.parse(req.url).pathname;
		
				logger.info('Handle Request - ' + uri);	

				var request = new Request(req, context.settings);
				var response = new Response(res);

				request.session();

				handle(context.router, uri, request, response, function(err, controller) {

					// Check if there are errors if so throw error and let the domain catch it.
					if(err !== null) {
						logger.warn('There was an error. Send error to errorHandler');
						throw err;
					}
						
					logger.info('No errors continue execution.');
				
					logger.debug('Get Request and Response object from controller');
					
					var request = controller.request.internal;
					var response = controller.response.internal;
					
					logger.debug('Check if headers are already set');
					
					// If headers are already sent than we can just end the response here.
					if(response.headersSent) {
						response.end();
					}
					
					logger.debug('Set cookie headers');
					
					// Need to get the Set Cookie headers first.
					if(controller.response.headers('Set-Cookie')) {
						response.setHeader('Set-Cookie', controller.response.headers('Set-Cookie'));
						delete controller.response.headers()['Set-Cookie'];
					}
					
					logger.debug('Set default headers');
					
					// Write headers and content than end the response.
					response.setHeader('Content-Length', controller.response.contentLength());
					response.setHeader('Content-Type', 'text/html; charset=utf-8');
					response.setHeader('Server', 'Manuras Framework Server');
					if(context.settings.server.poweredBy) controller.response.headers('X-Powered-By', 'Node.js/' + process.version);
					
					logger.debug('Write head and body.');
					
					response.writeHead(controller.response.status(), controller.response.headers());
					response.write(controller.response.body);
					
					logger.info('End response');
					response.end();
				});
			});
		});
	};
}

/**
 * Will try to find an controller and action based on the url and controller
 * 
 * @param router
 * @param url
 * @param controller
 * @param callback
 */
function handle(router, uri, req, res, callback) {
	
	router.findController(uri, this, function(err,routeResults) {
		
		if(err !== null) {
			callback(err);
		}
		
		var action = routeResults.action;
		var controller = routeResults.controller;
		var controllerName = routeResults.controllerName;
		var optionals = routeResults.optionals;
		
		// if there is an action and the action is a function we can run the action.
		if(action && controller) {		
			logger.debug('Action found. Insert additional data and execute the function.');
			
			controller.request = req;
			controller.response = res;
			controller.callback = callback;
			controller.name = controllerName;
			controller.action = action;
			
			controller.request.params = optionals;
			
			var before = controller.before.bind(controller);
			var action = controller[action].bind(controller);
			var after = controller.after.bind(controller);
			
			async.series([
				before,
				action,
				after
			], function(err) {	
				callback(err,controller);
			});
		} else {
			var message = 'No route found that matches. URL: ' +  url;
			callback(new NotFoundError(message), controller);
		}
	});
};

/**
 * Sets the server which loaded this request handler.
 * 
 * @param server
 * @param callback
 */
function setServer(server, callback) {
	s = server;
	callback();
}

exports.handle = handle;
exports.handler = handler;
exports.setServer = setServer;
