var async = require('async')
	, fs = require('fs')
	, logger = require('log4js').getLogger('manuras')
	, path_module = require('path');

var config = require('./../config')
	, Loader = require('./../server/loader')
	, View = require('./../mvc/view');

var settings = {};

var root = '';
var path = '';

var engineLoader;
var viewLoader;

/**
 * Loads the template engines from the engine folder and caches them.
 * 
 * @param rootPath
 */
function init(rootPath) {
	root = rootPath;

	settings = config.getSettings();

	var viewPaths = [];

	viewPaths.push(path_module.join(root, settings.paths.views));
	viewPaths.push(path_module.join(__dirname, './../resources/views/error'));

	viewLoader = new Loader(viewPaths);

	var enginePaths = [];

	enginePaths.push(path_module.join(root, 'lib/templating/drivers'));
	enginePaths.push(path_module.join(__dirname, 'drivers'));

	engineLoader = new Loader(enginePaths);
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

	engineLoader.require(templateEngine, function(err,require) {

		if(err) {
			return(callback(new Error('The template engine cannot be found. Either the name of the engine is wrong or the engine has no driver.')));
		}

		var templateEngineRequire = require;
		
		viewLoader.file(view.file, templateEngineRequire.extensions(), function(err,result) {

			if(err) {
				callback(err);
			}

			var viewPath = result;

			var subViews = [];
			var results = [];
			
			// get all subviews from this view
			for(var key in view.data) {
				if(view.data[key] instanceof view.constructor) {				
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
		});
	});
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

//TODO: needs caching of the fileContent
	getFileContent(path, settings.templating.encoding, function(err,fileContent) {		
		engine.render(path, fileContent, data, function(err,data) {
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
	engine.render(path, '', data, function(err,data) {
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
function getFileContent(path, encoding, callback) {
	fs.readFile(path, encoding, function(err, content) {			
		callback(err,content)
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