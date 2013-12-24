
var config = require('./../config')
	, logger = require('log4js').getLogger('manuras');

var caches = {};

var root = '';
var settings = {};

function init(proot) {
	root = proot;
	settings = config.getSettings();
}

function instance(name, driver, callback) {

	if(typeof callback === 'undefined') {
		callback = driver;
		driverName = settings.cache.driver;
	}

	console.log(driverName);

	if(typeof caches[name] === 'undefined') {
		try {
			var Driver = require('./drivers/' + driverName);
			driver = new Driver(name,root,settings);

			caches[name] = driver;
		} catch(e) {
			return(callback(new Error('The cache driver does not exist.')));
		}
	}

	callback(null,caches[name]);
} 

exports.init = init;
exports.instance = instance;