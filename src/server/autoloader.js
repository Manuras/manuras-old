/**
 * This file contains the functions to load and get handlers.
 */

var fs = require("fs");
var path_module = require("path");

var controllers = {};
var basePath = "";

function loadControllers(path) {
	
	if(basePath === "") { basePath = path; }
	
	var stats = fs.lstatSync(path);
	
	if(stats.isDirectory()) {
		var files = fs.readdirSync(path);
		var length = files.length;
		var f;
		
		for(var i = 0; i < length; i++) {
			f = path_module.join(path, files[i]);
			loadControllers(f);
		}
	} else {	
		name = path.replace(basePath, "").replace(".js", "").substring(1);
		controllers[name] = { "path": path, "require": require(path) };
	}
}

exports.loadControllers = loadControllers;
exports.controllers = controllers;