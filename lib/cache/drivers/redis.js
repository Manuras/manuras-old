var logger = require('log4js').getLogger('manuras')
	, redis = require('redis');

var BaseCache = require('./../basecache');

function Redis(name, root, settings) {
	BaseCache.call(this, name, root, settings);
	this.client = redis.createClient();
}

Redis.prototype  = new BaseCache();

/**
 * Put a value with a key in the cache.
 * 
 * @param key
 * @param value
 * @param experation
 * @param callback
 */
Redis.prototype.put = function(key, value, experation, callback) {
	var self = this;

	if(typeof callback === 'undefined') {
		callback = experation;
		experation = this.settings.cache.experation;
	}

	this.client.set(this.redisKey(key), value, function(err,red) {
		self.client.expire(redisKey, experation, function(err,red) {
			callback(err,red);
		});
	});
}

/**
 * Get a value from the cache by a certain key 
 * 
 * @param key
 * @param callback
 */
Redis.prototype.get = function(key, callback) {
	this.client.get(this.redisKey(key), function(err,reply) {
		callback(err, reply.toString());
	});
}

/**
 * Check if the cache has a certain key
 * 
 * @param key
 * @param callback
 */
Redis.prototype.has = function(key, callback) {
	this.client.exists(this.redisKey(key), function(err,data) {
		callback(err,data);
	});
}

/**
 * Remove the entry from the cache based on the key
 * 
 * @param key
 * @param callback
 */
Redis.prototype.remove = function(key, callback) {
	this.client.del(this.redisKey(key), function(err,data) {
		callback(err,data);
	});
}

Redis.prototype.redisKey = function(key) {
	return this.name + ':' + key;
}

module.exports = Redis;