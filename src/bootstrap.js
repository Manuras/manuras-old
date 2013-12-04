/**
 * Entry point of the Manuras Framework test
 */

var clusterserver = require("./cluster/clusterserver");

/**
 * Bootstraps the Manuras Framework. Will first load required information and after that start a new server.
 * This file also provides the interface for the user of the framework to use.
 * 
 * @param root
 */
function run(root) {	
	clusterserver.start(root);
}

exports.run = run;

// Interfaces for user
exports.View = require("./mvc/view");
exports.config = require("./config");

