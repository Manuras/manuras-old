
var config = require('./../config');

function BaseCache(name, root, settings) {
	this.name = name;
	this.root = root;
	this.settings = settings;
}

BaseCache.prototype.put = function(key, value, experation, callback) {

}

BaseCache.prototype.get = function(key, callback) {
	
}

BaseCache.prototype.has = function(key, callback) {
	
}

BaseCache.prototype.remove = function(key, callback) {
	
}

BaseCache.prototype.removeAll = function(key, callback) {
	
}

module.exports = BaseCache;