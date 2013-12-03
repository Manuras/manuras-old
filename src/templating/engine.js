
var fs = require("fs")
	, path_module = require("path");

var config = require("./../config");
var root = "";

var engines = {};

/**
 * Renders the page and returns the result as a string.
 * 
 * @param file
 * @param data
 * @param templateEngine
 * @param callback
 * @returns rendered page as string.
 */
function render(file, data, templateEngine, callback) {
	if(engines.hasOwnProperty(templateEngine)) {
		var settings = config.getSettings();
		var viewPath = path_module.join(root, path_module.join(settings.paths.views, file));
		
		// check render type of the engine and call the right function
		switch(engines[templateEngine].renderType()) {
			case "string":
				renderString(engines[templateEngine], viewPath, data, function(err,data) {
					callback(err,data);
				});
				break;
			case "file":
				renderFile(engines[templateEngine], viewPath, data, function(err,date) {
					callback(err,data);
				});
				break;
			default:
				callback({"err": "The template engine has an unsupported renderType"}, {});
				break;
		}
	}
}

/**
 * Render a page based on a string.
 * 
 * @param engine
 * @param path
 * @param data
 * @param callback
 * @returns rendered page
 */
function renderString(engine, path, data, callback) {
	engine.render(getFileContent(path), data, function(err,data) {
		callback(err,data);
	});
}

/**
 * Render a page based on a path to a file.
 * 
 * @param engine
 * @param path
 * @param data
 * @param callback
 * @returns rendered page
 */
function renderFile(engine, path, data, callback) {
	return engine.render(path, data, function(err,data) {
		callback(err,data);
	});
}

/**
 * Get all the content from a file
 * 
 * @param path
 * @param extension
 * @returns
 */
function getFileContent(path, extension) {
	if(typeof(extension) !== "string") {
		extension = ".html";
	}
	
	console.log("Get File Content");
	
	var filePath = path + extension;
	
	try {
		return fs.readFileSync(filePath, settings.templating.encoding);
	} catch(err) {
		throw err;
	}
}

/**
 * Add a template engine to the engine list.
 * 
 * @param name
 * @param require
 */
function addEngine(name, require) {
	engines[name] = require;
}

/**
 * Loads the template engines from the engine folder and caches them.
 * 
 * @param rootPath
 */
function loadEngines(rootPath) {
	root = rootPath;
	
	var path = path_module.join(__dirname, "engines");

	var files = fs.readdirSync(path);
	var length = files.length;
	var f;
	
	for(var i = 0; i < length; i++) {
		name = files[i].replace(".js", "");
		
		var filePath = path_module.join(path, files[i]);
		
		console.log(require(filePath));
		
		addEngine(name, require(filePath));
	}
}

exports.render = render;
exports.addEngine = addEngine;
exports.loadEngines = loadEngines;