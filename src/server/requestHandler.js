var domain = require("domain")
	, url = require("url");

var Request = require("./context/request")
	, Response = require("./context/response")
	, Controller = require("./../mvc/controller");

var s = undefined;
var a;

/**
 * Handles all incoming requests that weren't handled by the previous connect middleware.
 * 
 * @param settings
 * @returns {Function}
 */
function handler(context) {	
	return function(req, res, next) {
		var d = domain.create();
		
		d.on("error", function(err) {
			next({context: context, server: s, error: err});
		});
	
		d.add(req);
		d.add(res);
		
		d.run(function() {
			
			setTimeout(function() {	
				var pathname = url.parse(req.url).pathname;
		
				console.log("Handle Request - " + pathname);
				
				request = new Request(req);
				response = new Response(res);
				
				controller = new Controller(request, response);		
				
				handle(context.router, pathname, controller, function(controller, err) {

					console.log("Errors during handling: ");
					console.log(err);
					
					// Check if there are errors if so fire error event.
					if(JSON.stringify(err) !== "{}" && typeof err !== "undefined") {
						
						console.log("There was an error. Firing the error events.");
					
				/*		if(err["code"] === 404) {
							requestHandler.emit('not-found', controller.request, controller.response, err);
						} else {
							requestHandler.emit('error', controller.request, controller.response, err);
						}*/
						
						return next();
					}
					
					console.log("No errors continue execution.");
					
					console.log("Get Request and Response object from controller");
					
					var request = controller.request.internal;
					var response = controller.response.internal;
					
					console.log("Check if headers are already set");
					
					// If headers are already sent than we can just end the response here.
					if(response.headersSent) {
						response.end();
					}
					
					console.log("Set cookie headers");
					
					// Need to get the Set Cookie headers first.
					if(controller.response.headers("Set-Cookie")) {
						response.setHeader("Set-Cookie", controller.response.headers("Set-Cookie"));
						delete controller.response.headers()["Set-Cookie"];
					}
					
					console.log("Set default headers");
					
					// Write headers and content than end the response.
					response.setHeader("Content-Length", controller.response.contentLength());
					response.setHeader("Content-Type", "text/html; charset=utf-8");
					response.setHeader("Server", "Manuras Framework Server");
					if(context.settings.server.poweredBy) controller.response.headers("X-Powered-By", "Node.js/" + process.version);
					
					console.log("Write head and body.");
					
					response.writeHead(controller.response.status(), controller.response.headers());
					response.write(controller.response.body);
					
					response.end();
				});
			});
		});
	};
}

/**
 * Will try to find an controller and action based on the pathname and controller
 * 
 * @param pathname
 * @param controller
 * @param callback
 */
function handle(router, pathname, controller, callback) {
	
	var routeResults = router.findController(pathname, this);
	
	var action = routeResults.action;
	var optionals = routeResults.optionals;
	
	// if there is an action and the action is a function we can run the action.
	if(action) {
		if(typeof action === "function") {
			
			console.log("Action found. Insert additional data and execute the function.");
		
			controller.request.params = optionals;
			controller.callback = callback;
			controller.action = action;
			
			controller.action(function(err) {
				callback(controller, err);
			});
		} else {
				
			var message = "Action does not exist, but there was a matching route. This means there is a route with a controller:action combination that does not exist";
			
			console.log(message);
			callback(controller, { code: 404, message: message });
		}
	} else {
		var message = "No route found that matches. Path: " +  pathname;
		
		console.log(message);
		callback(controller, { code: 404, message: message });
	}
};

function setServer(server, callback) {
	s = server;
	callback();
}

exports.handle = handle;
exports.handler = handler;
exports.setServer = setServer;
