
var config = require('./../config')
	, logger = require('log4js').getLogger('manuras')
	, path_module = require('path');

var Loader = require('./../server/loader');

var caches = {};

var root = '';
var settings = {};

var loader;

function init(proot) {
	root = proot;
	settings = config.getSettings();

	var paths = [];

	paths.push(path_module.join(root, 'lib/cache/drivers'));
	paths.push(path_module.join(__dirname, 'drivers'));

	loader = new Loader(paths);
}

function instance(name, driver, callback) {

	if(typeof callback === 'undefined') {
		callback = driver;
		driverName = settings.cache.driver;
	}

	if(typeof caches[name] === 'undefined') {
		loader.require(driverName, function(err,require) {

			if(err) {
				return(callback(new Error('The cache driver does not exist.')));
			}

			var Driver = require;

			driver = new Driver(name,root,settings);
			caches[name] = driver;

			callback(null,driver);
		});
	} else {
		callback(null,caches[name]);
	}
} 

exports.init = init;
exports.instance = instance;