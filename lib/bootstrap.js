var cluster = require('cluster')
	, log4js = require('log4js');

var clusterserver = require('./cluster/clusterserver');
var Worker = require('./cluster/worker');
	
var logger = log4js.getLogger('manuras');

/**
 * Bootstraps the Manuras Framework. Will first load required information and after that start a new server.
 * This file also provides the interface for the user of the framework to use.
 * 
 * @param root
 */
function run(root) {
	
	if(cluster.isMaster) {
		logger.info("Starting Application");
		clusterserver.start(root);
	} else {
		new Worker().start();
	}
}

exports.run = run;

// Interfaces for user
exports.BaseCache = require('./cache/basecache');
exports.Controller = require('./mvc/controller');
exports.ControllerTemplate = require('./mvc/controller/template');
exports.ControllerRest = require('./mvc/controller/rest');
exports.Validation = require('./validation');
exports.View = require('./mvc/view');

exports.cache = require('./cache');
exports.config = require('./config');
exports.logger = log4js;
