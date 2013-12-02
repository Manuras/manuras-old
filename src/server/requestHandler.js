var events = require("events");

function RequestHandler(router) {
	this.router = router;
}

RequestHandler.prototype = new events.EventEmitter;

RequestHandler.prototype.handle = function(pathname, controller, callback) {
	
	var routeResults = this.router.findController(pathname, this);
	
	var action = routeResults.action;
	var optionals = routeResults.optionals;
	
	if(action) {
		if(typeof action === "function") {
			
			console.log("Action found. Insert additional data and execute the function.");
		
			controller.request.params = optionals;
			controller.callback = callback;
			
			controller.action = action;
			controller.action();
			
			callback(controller, {});
			return;
			
		} else {
			
			var message = "Action does not exist, but there was a matching route. This means there is a route with a controller:action combination that does not exist";
			
			console.log(message);
			callback(controller, { code: 404, "message": message });
			return;
		}
	}
	
	var message = "No route found that matches. Path: " +  pathname;
	
	console.log(message);
	callback(controller, { code: 404, "message": message });
};

module.exports = RequestHandler;
