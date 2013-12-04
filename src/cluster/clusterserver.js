
var cluster = require("cluster")
	, os = require("os")
	, path = require("path");

var config = require("./../config");

function start(root) {
	if(cluster.isMaster) {
		
		var settings = config.loadConfig(root);
		
		var numCPUs = os.cpus().length;
		var workerPath = path.join(root, "cluster/worker.js");
		
		cluster.setupMaster({
			exec: workedPath,
			args: ["--environment", settings.app.env]
		});
		
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