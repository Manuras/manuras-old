
var fs = require('fs')
	, logger = require('log4js').getLogger('manuras')
	, path = require('path');

var BaseCache = require('./../basecache');

function Memory(name, root, settings) {
	BaseCache.call(this, name, root, settings);

	this.cache = {};

	setInterval(function() {
		var now = Date.now();

		for(var entry in this.cache) {
			if(this.cache[entry].experation < now) {
				logger.debug('Removing cache entry: ' + entry);
				this.remove(entry, function() {});
			}
		}
		
	}, this.settings.cache.interval * 1000);
}

Memory.prototype  = new BaseCache();

/**
 * Put a value with a key in the cache.
 * 
 * @param key
 * @param value
 * @param experation
 * @param callback
 */
Memory.prototype.put = function(key, value, experation, callback) {
	if(typeof callback === 'undefined') {
		callback = experation;
		experation = this.settings.cache.experation;
	}
	
	this.cache[key] = {value: value, experation: experation};
	callback(null, this.cache[key].value);
}

/**
 * Get a value from the cache by a certain key 
 * 
 * @param key
 * @param callback
 */
Memory.prototype.get = function(key, callback) {
	if(typeof this.cache[key] !== 'undefined') {
		callback(null, this.cache[key].value);
	} else {
		callback(null, undefined);
	}
}

/**
 * Check if the cache has a certain key
 * 
 * @param key
 * @param callback
 */
Memory.prototype.has = function(key, callback) {
	if(typeof this.cache[key] !== 'undefined') {
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
Memory.prototype.remove = function(key, callback) {
	delete this.cache[key];
	callback(null);
}

module.exports = Memory;