var async = require('async')
	, fs = require('fs')
	, logger = require('log4js').getLogger('manuras')
	, path = require('path');

function Loader(locations, cache) {
	this.locations = locations;
	this.doCache = typeof cache === 'undefined' ? true : cache;

	this.cache = {};
}

Loader.prototype.require = function(name, callback) {
	this.file(name, ['js'], function(err,result) {
		if(err === null) {
			callback(null, require(result));
		} else {
			callback(err);
		}
	});
};

Loader.prototype.file = function(name, extensions, callback) {
	var self = this;

	if(this.doCache && typeof this.cache[name] !== 'undefined') {
		logger.trace('The entry: ' + name + ' is cached.');
		callback(null, this.cache[name]);
	} else {
		logger.trace('The entry: ' + name + ' is not cached.');
 
		paths = [];
		this.locations.forEach(function(entry) {
			extensions.forEach(function(extension) {
				paths.push(path.join(entry, name) + '.' + extension);
			});
		});

		async.detectSeries(paths, fs.exists, function(result) {
			if(typeof result !== 'undefined') {

				if(self.doCache) {
					self.cache[name] = result;
				}

				callback(null, result);
			} else {
				callback(new Error('The loader couldn\'t find the file.'));
			}
		});
	}
}

module.exports = Loader;
