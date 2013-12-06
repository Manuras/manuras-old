/**
 * This file contains functions that handle the routing.
 */

var fs = require('fs')
	, path = require('path');

var controllers = {};
var rawRoutes = {};
var routes = {};

/**
 * Compiles the raw routes into usable routes which can be used to route urls to controllers and actions.
 * 
 * @param controllerFiles
 */
function compile(controllerFiles) {
	
	controllers = controllerFiles;
	
	for(var name in rawRoutes) {

		routes[name] = {};
		
		for(var key in rawRoutes[name]) {
			if(key === 'route' && rawRoutes[name][key]) {		
				
				// Get Optionals from route			
				rawOptionals = rawRoutes[name][key].split(/{(.*?)}/);
				optionals = [];
				
				for(var i = 0; i < rawOptionals.length; i++) {
					if(rawOptionals[i] !== '' && rawOptionals[i].indexOf('/') === -1) {
						optionals.push(rawOptionals[i]);
					}
				}
				
				routes[name]['optionals'] = optionals;
				
				// Generate regex from route
				regex = rawRoutes[name][key].replace(/{([^}]*)\}/g, '([^/.,;?]*)');	
				routes[name]['regex'] = new RegExp('^' + regex + '$'); 
				
			} else if(key === 'controller' && rawRoutes[name][key]) {
				
				// Get Controller and Action from the route
				var controllerString = rawRoutes[name][key];
				var controllerParts = controllerString.split(':');
				
				if(controllerParts.length !== 2) throw { 'message': 'A Route doesn\'t have two parts. The controller field looks {controller}:{action}' };
				
				routes[name]['controller'] = controllerParts[0];
				routes[name]['action'] = controllerParts[1];
				
			}
		}
	}
}

/**
 * Loads the raw routes from the routes files.
 * 
 * @param file
 * @param callback
 */
function loadRoutes(file, callback) {
	fs.exists(file, function(exists) {
		if(exists) {
			rawRoutes = require(file);
			callback();
		} else {
			callback({msg: 'Routes file doesn\'t exists. Check if the file exists or change the path in the settings file.'});
		}
	});
}

/**
 * Finds a controller based on the url.
 * 
 * @param url
 * @param requestHandler
 * @returns boolean, if controller was found
 */
function findController(url, requestHandler) {
	
	for(var key in routes) {
		
		var regexInfo = routes[key]['regex'].exec(url);
		
		if(regexInfo) {
			
			console.log('Route match found. Executing - ' + routes[key]['controller'] + ':' + routes[key]['action']);		
			
			var optionals = {};
			
			// If regexInfo length is greater than 1 than there are optionals so we will grab them and make them available in the controller
			if(regexInfo.length > 1) {
				for(var i = 1; i < regexInfo.length; i++) {
					optionals[routes[key]['optionals'][i-1]] = regexInfo[i];
				}
			}

			// Get the action from the controller cache	
			var action = routes[key]['action'];
			
			// Create a controller object from the require in the cache
			var Controller = controllers[routes[key]['controller']]['require'];		
			var controller = new Controller();
			
			// Check if the action function exists in the controller (sanity check)
			if(typeof controller[action] !== 'function') {
				return false;
			}
			
			// Pack the info we gathered into a single object and return it
			return { 'action': action, 'controller': controller, 'optionals': optionals };
		}
	}
	
	return false;
}

exports.compile = compile;
exports.loadRoutes = loadRoutes;
exports.findController = findController;
