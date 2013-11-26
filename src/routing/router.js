/**
 * This file contains functions that handle the routing.
 */

var handlers = {};
var routes = {};

function compile(handlers, rawRoutes) {
	
	this.handlers = handlers;
	
	console.log(handlers);
	
	for(var name in rawRoutes) {

		routes[name] = {};
		
		for(var key in rawRoutes[name]) {	
			if(key === "route" && rawRoutes[name][key]) {		
				
				// Get Optionals from route			
				rawOptionals = rawRoutes[name][key].split(/{(.*?)}/);
				optionals = {};
				
				for(var i = 0; i < rawOptionals.length; i++) {
					if(rawOptionals[i] !== "" && rawOptionals[i].indexOf("/") === -1) {
						optionals[rawOptionals[i]] = 1;
					}
				}
				
				routes[name]["optionals"] = optionals;
				
				// Generate regex from route
				regex = rawRoutes[name][key].replace(/{([^}]*)\}/g, "([^/.,;?]*)");
				routes[name]["regex"] = new RegExp(regex); 
				
			} else if(key === "handler" && rawRoutes[name][key]) {
				
				// Get Handler and Action from the route
				var handlerString = rawRoutes[name][key];
				var handlerParts = handlerString.split(":");
				
				if(handlerParts.length !== 2) throw { "message": "Route Handler doesn't have two parts. The handler field should look like this: {handler}:{action}"};
				
				routes[name]["handler"] = handlerParts[0];
				routes[name]["action"] = handlerParts[1];
				
			}
		}
	}
	
	
	console.log(routes);
}

function handle(pathname, request, response) {
	
	for(var key in routes) {
		if(routes[key]["regex"].test(pathname)) {
			
			console.log("Route match found. Executing - " + routes[key]["handler"] + ":" + routes[key]["action"]);
			
			var handler = this.handlers[routes[key]["handler"]];
			var f = handler["require"][routes[key]["action"]];
			
			console.log(handler);
			
			if(typeof f === "function") {
				console.log("Action found. Excuting the function.");
				f(request, response);
			} else {
				console.log("Action does not exists. This means the routes aren't correct.");
			}
			
			response.end();
		}
	}
}

exports.compile = compile;
exports.handle = handle;
