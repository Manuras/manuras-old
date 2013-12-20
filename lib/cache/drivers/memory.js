
var fs = require('fs')
	, logger = require('log4js').getLogger('manuras')
	, path = require('path');

var settings = {};
var root = '';

var cache = {};

/**
 * Put a value with a key in the cache.
 * 
 * @param key
 * @param value
 * @param experation
 * @param callback
 */
function put(key, value, experation, callback) {
	if(typeof callback === 'undefined') {
		callback = experation;
		experation = settings.cache.experation;
	}

	console.log("Putting");
	console.log(experation);
	
	cache[key] = {value: value, experation: experation};
	callback(null, cache[key].value);
}

/**
 * Get a value from the cache by a certain key 
 * 
 * @param key
 * @param callback
 */
function get(key, callback) {
	callback(null, cache[key].value);
}

/**
 * Check if the cache has a certain key
 * 
 * @param key
 * @param callback
 */
function has(key, callback) {
	if(typeof cache[key] !== 'undefined') {
		callback(null,true);
	} else {
		callback(null,false);
	}	
}

/**
 * Remove the entry from the cache based on the key
 * 
 * @param key
 * @param callback
 */
function remove(key, callback) {
	delete cache[key];
	callback(null);
}

/**
 * Set the config settings
 * 
 * @param value
 */
function setSettings(value) {
	settings = value;
	
	setInterval(function() {
		
		var now = Date.now();

		for(var entry in cache) {
			if(cache[entry].experation < now) {
				logger.debug('Removing cache entry: ' + entry);
				remove(entry, function() {});
			}
		}
		
	}, settings.cache.interval * 1000);
	
}

/**
 * Set the root of the application
 * 
 * @param value
 */
function setRoot(value) {
	root = value;
}

exports.put = put;
exports.get = get;
exports.has = has;
exports.remove = remove;
exports.setSettings = setSettings;
exports.setRoot = setRoot;