
var config = require('./../config')
	, logger = require('log4js').getLogger('manuras');

var settings;
var driver;

function init(root) {
	settings = config.getSettings();
	driver = require('./drivers/' + settings.cache.driver + '.js');
	
	driver.setRoot(root);
	driver.setSettings(settings);
}

function put(key, value, experation, callback) {
	driver.put(key, value, experation, function(err,data) {
		callback(err,data);
	});
}

function get(key, callback) {
	driver.get(key, function(err,data) {
		callback(err,data);
	});
}

function has(key, callback) {
	driver.has(key, function(err,data) {
		callback(err,data);
	});	
}

function remove(key, callback) {
	driver.remove(key, function(err,data) {
		callback(err,data);
	});
}

exports.init = init;
exports.put = put;
exports.get = get;
exports.has = has;
exports.remove = remove;