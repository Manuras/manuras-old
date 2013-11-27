/**
 * Server for the Manuras Framework. Uses Connect to create the app and handle all incoming requests.
 */
var connect = require("connect");

var cluster = require("cluster");
var http = require("http");
var numCPUs = require("os").cpus().length;
var url = require("url");

var Request = require("./context/request");
var Response = require("./context/response");

var Controller = require("./../mvc/controller");

function start(config, requestHandler, port) {
	
	if(cluster.isMaster) {
		
		for(var i = 0; i < numCPUs; i++) {
			cluster.fork();
		}
		
		cluster.on("exit", handleWorker);
		
	} else {
		
		var app = connect();
		
		if(config.environment === config.environments["dev"]) {
			app.use(connect.logger("short"));
		}
				
		app.use(connect.static(config.public))
			.use(connect.query())
		   	.use(function(req, res, next) {
				var pathname = url.parse(req.url).pathname;
				
				request = new Request(req);
				response = new Response(res);
				
				controller = new Controller(request, response);		
				
//TODO: This needs to be handled more elegant and at a different location. Also the user should be able to override this.
				requestHandler.on('error', function(request, response, err) {
					
					console.log("Error");
					
					response.internal.writeHead(500, { "Content-Type" : "text/html" });
					response.internal.write("500 - Internal Server Error. Error: " + JSON.stringify(err));
					response.internal.end();
				});
				
				requestHandler.on('not-found', function(request, response, err) {
					
					console.log("Page not found");
					
					response.internal.writeHead(404, { "Content-Type" : "text/html" });
					response.internal.write("404 - Not Found. Error: " + JSON.stringify(err));
					response.internal.end();
				});
				
				requestHandler.handle(pathname, controller, function(controller, err) {
					
					console.log(err);
					
					// Check if there are errors if so fire error event.
					if(JSON.stringify(err) !== "{}") {
						
						console.log("There was an error. Firing the error events.");
						
						if(err["code"] === 404) {
							requestHandler.emit('not-found', controller.request, controller.response, err);
						} else {
							requestHandler.emit('error', controller.request, controller.response, err);
						}
						
						return next();
					}
					
					console.log("No errors continue execution.");
					
					var request = controller.request.internal;
					var response = controller.response.internal;
					
					// If headers are already sent than we can just end the response here.
					if(response.headersSent) {
						response.end();
					}
					
					// If there are no errors send content to client.
					response.writeHead(200, { "Content-Length": controller.response.content.length, "Content-Type": "text/html" });
					response.write(controller.response.content);
					response.end();
				});
				
				return;	
		});
		
		http.createServer(app).listen(port);
		console.log("New server worker has started on port: " + port + " with id: " + cluster.worker.id);
		
	}
}

function handleWorker(worker, code, signal) {
	console.log("worker " + worker.process.pid + " died");
	cluster.fork();
}

exports.start = start;