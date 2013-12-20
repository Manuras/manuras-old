/**
 * This file contains the functions to load and get handlers.
 */

var config = require('./../config')
	, fs = require('fs')
	, logger = require('log4js').getLogger('manuras')
	, path_module = require('path');

var controllers = {};
var basePath = '';

var settings = {};

/**
 * Function that initializes when a worker starts. Will set the config settings and the controller base path.
 */
function init(configSettings, path) {
	settings = configSettings;
	basePath = path;
}

/**
 * Loads all controllers from the controller directory and caches them.
 * 
 * @param path
 */
function load(controller, callback) {	
	var controllerPath = path_module.join(basePath, controller) + '.js';
	
	if(process.env.NODE_ENV !== settings.app.env.dev) {
		if(typeof controllers[controllerPath] === 'undefined') {
			var Controller = require(controllerPath);
			controllers[controllerPath] = Controller;
			callback(null, Controller);
		} else {
			callback(null, controllers[controllerPath]);
		}
	} else {
		callback(null, requireUncached(controllerPath));
	}
}

/**
 * In development requires of controllers will be uncached. This allows for editing while the server runs.
 */
function requireUncached(module) {
	delete require.cache[require.resolve(module)];
	return require(module)
}

exports.load = load;
exports.init = init;
exports.controllers = controllers;