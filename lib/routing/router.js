/**
 * This file contains functions that handle the routing.
 */

var fs = require('fs')
	, path = require('path')
	, logger = require('log4js').getLogger();

var controllerLoader = require('./../server/controllerLoader');

var controllers = {};
var rawRoutes = {};
var routes = {};

/**
 * Compiles the raw routes into usable routes which can be used to route urls to controllers and actions.
 * 
 * @param controllerFiles
 */
function compile() {
	
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
				regex = rawRoutes[name][key].split('(').join('(?:');
				regex = regex.split(')').join(')?');				
				regex = regex.replace(/{([^}]*)\}/g, '([^/.,;?]*)');

				routes[name]['regex'] = new RegExp('^' + regex + '$'); 
				
			} else if(key === 'controller' && rawRoutes[name][key]) {
				
				// Get Controller and Action from the route
				var controllerString = rawRoutes[name][key];
				var controllerParts = controllerString.split(':');
				
				if(controllerParts.length !== 2) throw { 'message': 'A Route doesn\'t have two parts. The controller field should look like this controller:action' };
				
				routes[name]['controller'] = controllerParts[0];
				routes[name]['action'] = controllerParts[1];
				
			} else if(key === 'defaults' && rawRoutes[name][key]) {
				
				// Get default values from the route
				routes[name]['defaults'] = rawRoutes[name][key];			
			} else if(key === 'requirements' && rawRoutes[name][key]) {
				
				// Get requirements from routes
				routes[name]['requirements'] = {};
				
				for(var k in rawRoutes[name][key]) {
					routes[name]['requirements'][k] = rawRoutes[name][key][k];
				}
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
function findController(url, requestHandler, callback) {
	
	var routeCount = Object.keys(routes);
	var routeFound = false;
	var doneCount = 0;

	for(var key in routes) {
		
		var regexInfo = routes[key]['regex'].exec(url);
		
		if(regexInfo) {
			
			routeFound = true;
			doneCount += routeCount;

			logger.info('Route match found. Executing - ' + routes[key]['controller'] + ':' + routes[key]['action']);		
			
			// Try to load the Controller (lazy loading + cache)
			controllerLoader.load(routes[key]['controller'], function(err, Controller) {
				
				console.log('Controller Loading done');

				if(err !== null) {
					return(callback({code: 404, msg: err.msg}));
				}

				// Create a controller object
				var controller = new Controller();

				// Get the action from the routes	
				var action = routes[key]['action'];

				var optionals = {};
				
				// If regexInfo length is greater than 1 than there are optionals so we will grab them and make them available in the controller
				if(regexInfo.length > 1) {
					for(var i = 1; i < regexInfo.length; i++) {
						
						if(typeof regexInfo[i] !== 'undefined') {
							optionals[routes[key]['optionals'][i-1]] = regexInfo[i];
						} else {
							optionals[routes[key]['optionals'][i-1]] = routes[key]['defaults'][routes[key]['optionals'][i-1]];
						}
					}
				}
				
				// Check if the optionals follow the requirements
				for(var req in routes[key]['requirements']) {	
					if(!(typeof optionals[req] !== 'undefined' && routes[key]['requirements'][req].test(optionals[req]))) { 
						return(callback({code: 404, msg: 'A route was found, but the route didn\'t follow the requirements'})); 
					}
				}
				
				// Check if the action function exists in the controller (sanity check)
				if(typeof controller[action] !== 'function') {
					return(callback({code: 404, msg: 'The action exists in the controller, but it is not a function.'}));
				}
				
				// Pack the info we gathered into a single object and return it
				return(callback(null, {'action': action, 'controller': controller, 'controllerName': key, 'optionals': optionals }));
			});
		} else {
			doneCount++;
		}
	}
	
	while(doneCount < routeCount) { };

	if(!routeFound) {
		console.log("Loop done");
		callback({code: 404, msg: 'No matching route was found.'});
	}
}

exports.compile = compile;
exports.loadRoutes = loadRoutes;
exports.findController = findController;
