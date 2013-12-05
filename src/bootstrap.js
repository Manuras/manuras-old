var cluster = require("cluster");

var clusterserver = require("./cluster/clusterserver");
var Worker = require("./cluster/worker");
	
/**
 * Bootstraps the Manuras Framework. Will first load required information and after that start a new server.
 * This file also provides the interface for the user of the framework to use.
 * 
 * @param root
 */
function run(root) {
	if(cluster.isMaster) {
		clusterserver.start(root);
	} else {
		new Worker().start();
	}
}

exports.run = run;

// Interfaces for user
exports.View = require("./mvc/view");
exports.config = require("./config");

