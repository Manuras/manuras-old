
var config = require('./../config')
	, logger = require('log4js').getLogger('manuras')
	, path_module = require('path');

var Loader = require('./../server/loader');

var root = '';
var settings = {};

var loader = {};

function init(proot) {
	root = proot;
	settings = config.getSettings();

	var paths = [];

	paths.push(path_module.join(root, 'lib/session/drivers'));
	paths.push(path_module.join(__dirname, 'drivers'));

	loader = new Loader(paths);
}

function instance(name, driver, req, res, callback) {
	loader.require(driver, function(err,require) {
		if(err) {
			return(callback(new Error('The session driver does not exist.')));
		}

		var Driver = require;
		driver = new Driver(name,root,req,res,settings);
		
		callback(null,driver);
	});
} 

exports.init = init;
exports.instance = instance;