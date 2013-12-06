var domain = require('domain')
	, log4js = require('log4js')
	, url = require('url');

var Request = require('./context/request')
	, Response = require('./context/response')
	, Controller = require('./../mvc/controller');

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
				
				var request = new Request(req);
				var response = new Response(res);
				
				handle(context.router, uri, request, response, function(err, controller) {

					logger.warn('Errors during handling: ');
					console.log(err);
					
					// Check if there are errors if so fire error event.
					if(JSON.stringify(err) !== '{}') {
						
						console.log('There was an error. Firing the error events.');
					
				/*		if(err['code'] === 404) {
							requestHandler.emit('not-found', controller.request, controller.response, err);
						} else {
							requestHandler.emit('error', controller.request, controller.response, err);
						}*/
						
						return next();
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
					
					logger.info("End response");
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
	
	var routeResults = router.findController(uri, this);
	
	var action = routeResults.action;
	var controller = routeResults.controller;
	var optionals = routeResults.optionals;
	
	// if there is an action and the action is a function we can run the action.
	if(action && controller) {
		if(typeof controller[action] === 'function') {
			
			console.log('Action found. Insert additional data and execute the function.');
			
			controller.request = res;
			controller.response = res;
			controller.callback = callback;
			
			// Synchronous call so lets keep it small
			controller.before();
				
			controller.index(function(err) {
				if(typeof err !== 'undefined') {
					callback(err, controller);
				} else {
					// Synchronous call so lets keep it small
					controller.after();
					callback({}, controller);
				}
			});
		} else {
			var message = 'Action does not exist, but there was a matching route. This means there is a route with a controller:action combination that doesn\'t exist';
			
			console.log(message);
			callback(controller, { code: 404, message: message });
		}
	} else {
		var message = 'No route found that matches. URL: ' +  url;
		
		console.log(message);
		callback(controller, { code: 404, message: message });
	}
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
