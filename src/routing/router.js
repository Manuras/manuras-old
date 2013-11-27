/**
 * This file contains functions that handle the routing.
 */

var controllers = {};
var routes = {};

function compile(controllerFiles, rawRoutes) {
	
	controllers = controllerFiles;
	
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
				routes[name]["regex"] = new RegExp("^" + regex + "$"); 
				
			} else if(key === "controller" && rawRoutes[name][key]) {
				
				// Get Controller and Action from the route
				var controllerString = rawRoutes[name][key];
				var controllerParts = controllerString.split(":");
				
				if(controllerParts.length !== 2) throw { "message": "A Route doesn't have two parts. The controller field looks {controller}:{action}" };
				
				routes[name]["controller"] = controllerParts[0];
				routes[name]["action"] = controllerParts[1];
				
			}
		}
	}
}

function findController(pathname, requestHandler) {
	
	for(var key in routes) {
		if(routes[key]["regex"].test(pathname)) {
			
			console.log("Route match found. Executing - " + routes[key]["controller"] + ":" + routes[key]["action"]);		
			
			var controllerInfo = controllers[routes[key]["controller"]];
			var action = controllerInfo["require"][routes[key]["action"]];
			
			return action;
		}
	}
	
	return false;
}

exports.compile = compile;
exports.findController = findController;
