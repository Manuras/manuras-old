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
				optionals = [];
				
				for(var i = 0; i < rawOptionals.length; i++) {
					if(rawOptionals[i] !== "" && rawOptionals[i].indexOf("/") === -1) {
						optionals.push(rawOptionals[i]);
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
		
		var regexInfo = routes[key]["regex"].exec(pathname);
		
		if(regexInfo) {
			
			console.log("Route match found. Executing - " + routes[key]["controller"] + ":" + routes[key]["action"]);		
			
			var optionals = {};
			
			// If regexInfo length is greater than 1 than there are optionals so we will grab them and make them available in the controller
			if(regexInfo.length > 1) {
				for(var i = 1; i < regexInfo.length; i++) {
					optionals[routes[key]["optionals"][i-1]] = regexInfo[i];
				}
			}

			
			// Get the action from the controller cache
			var controllerInfo = controllers[routes[key]["controller"]];			
			var action = controllerInfo["require"][routes[key]["action"]];
			
			// Pack the info we gathered into a single object and return it
			return { "action": action, "optionals": optionals };
		}
	}
	
	return false;
}

exports.compile = compile;
exports.findController = findController;
