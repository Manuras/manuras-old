
var cluster = require("cluster")
	, os = require("os")
	, path = require("path");

var config = require("./../config");

/**
 * Start the cluster and create workers based on how much CPUs the server has. Also sends the root of the application to the workers and signals them to start.
 * This function also sets the listeners for when a worker disconnects so can create new workers.
 * 
 * @param root
 */
function start(root) {
	if(cluster.isMaster) {
		
		var settings = config.loadConfig(root);
		
		var numCPUs = os.cpus().length;
		var workerPath = "worker.js";
		
		for(var i = 0; i < numCPUs; i++) {
			var worker = cluster.fork();
			worker.send({root: root});
		}
		
		cluster.on("disconnect", function(worker) {
			console.log("Worker: " + worker.process.id  + " disconnected. Let's start a new one.");
			var worker = cluster.fork();
			worker.send({root: root});
		});
		
		cluster.on("exit", function(worker, code, signal) {
			console.log("Worker " + worker.process.pid + " died.");  
		});
	}
}

exports.start = start;