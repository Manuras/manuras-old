
var async = require('async')
	, fs = require('fs')
	, logger = require('log4js').getLogger('manuras')
	, path_module = require('path');

var config = require('./../config')
	, Loader = require('./../server/loader');
	, View = require('./../mvc/view');

var settings = {};

var root = '';
var path = '';

var loader;

/**
 * Loads the template engines from the engine folder and caches them.
 * 
 * @param rootPath
 */
function init(rootPath) {
	root = rootPath;
	path = path_module.join(__dirname, 'engines');

	settings = config.getSettings();
	loader = new Loader([path]);
}

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
	
	var templateEnginePath = path_module.join(path, templateEngine) + '.js';

	loader.load();

	try {
		var templateEngineRequire = require(templateEnginePath);
	} catch(e) {
		return(callback(new Error('The template engine cannot be found. Either the name of the engine is wrong or the engine has no driver.')));
	}
	
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
	
	// checks render type of the engine and call the right function, is used multiple times inside render() and only in render().
	function renderByType() {
		switch(templateEngineRequire.renderType()) {
			case 'string':
				renderStringFromFile(templateEngineRequire, viewPath, view.data, function(err,data) {
					callback(err,data);
				});				
				break;
			case 'file':
				renderFile(templateEngineRequire, viewPath, view.data, function(err,data) {
					callback(err,data);
				});
				break;
			default:
				callback(new Error('The template engine has an unsupported renderType'));
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

exports.render = render;
exports.addEngine = addEngine;
exports.init = init;