
var async = require('async')
	, fs = require('fs')
	, logger = require('log4js').getLogger('manuras')
	, path_module = require('path');

var config = require('./../config')
	, View = require('./../mvc/view');

var engines = {};

/**
 * Renders the file content and returns the result as a string.
 * 
 * @param file
 * @param data
 * @param templateEngine
 * @param callback
 * @returns rendered page as string.
 */
function render(view, templateEngine, callback) {	
	
	// check if the given engine is supported
	if(engines.hasOwnProperty(templateEngine)) {
		var settings = config.getSettings();
		var viewPath = path_module.join(settings.paths.views, view.file);
		
		var subViews = [];
		var results = [];
		
		// get all subviews from this view
		for(var key in view.data) {
			if(view.data[key] instanceof View) {				
				subViews.push({key: key, view: view.data[key]});
			}
		}
		
		// if  subviews is populated lets render those subviews and put the output in the parent view.
		if(subViews.length > 0) {
			subViews.forEach(function(subView) {		
				render(subView.view, templateEngine, function(err,data) {
					results.push({key: subView.key, data: data });
					
					if(results.length === subViews.length) {
						
						results.forEach(function(entry) {
							view.data[entry.key] = entry.data;
						});
						
						renderByType();
					}
				});
			});
		} else {
			renderByType();
		}
	}
	
	// checks render type of the engine and call the right function, is used multiple times inside render() and only in render().
	function renderByType() {
		switch(engines[templateEngine].renderType()) {
			case 'string':
				renderStringFromFile(engines[templateEngine], viewPath, view.data, function(err,data) {
					callback(err,data);
				});				
				break;
			case 'file':
				renderFile(engines[templateEngine], viewPath, view.data, function(err,data) {
					callback(err,data);
				});
				break;
			default:
				callback({'msg': 'The template engine has an unsupported renderType'}, {});
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
function renderStringFromFile(engine, path, data, callback) {
	var settings = config.getSettings();
	
	getFileContent(path, settings.templating.encoding, engine.extensions(), function(err,fileContent) {		
		engine.render(fileContent, data, function(err,data) {
			callback(err,data);
		});
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
	engine.render(path, data, function(err,data) {
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
function getFileContent(path, encoding, extensions, callback) {
	var data = '';

	async.each(extensions, function(ext, cb) {	
		var filePath = path + '.' + ext;

		fs.readFile(filePath, encoding, function(err, content) {			
			if(!err) {
				data = content;
			}
			
			cb();
		});
	}, function(err) {
		callback(err, data);
	});
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
	
	var path = path_module.join(__dirname, 'engines');

	var files = fs.readdirSync(path);
	var length = files.length;
	var f;
	
	for(var i = 0; i < length; i++) {
		name = files[i].replace('.js', '');
		
		var filePath = path_module.join(path, files[i]);
		addEngine(name, require(filePath));
	}
}

exports.render = render;
exports.addEngine = addEngine;
exports.loadEngines = loadEngines;