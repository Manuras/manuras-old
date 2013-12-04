/**
 * Server for the Manuras Framework. Uses Connect to create the app and handle all incoming requests.
 */

var connect = require("connect")
	, cluster = require("cluster")
	, domain = require("domain")
	, http = require("http")
	, numCPUs = require("os").cpus().length
	, url = require("url");

var config = require("./../config");

var Request = require("./context/request")
	, Response = require("./context/response")
	, Controller = require("./../mvc/controller");

/**
 * Starts the server and sets up a cluster that will fork requests to the workers.
 * 
 * @param requestHandler
 * @param port
 * @param root
 */
function start(requestHandler, port, root) {

	var settings = config.getSettings();
	
	if(cluster.isMaster) {
		
		for(var i = 0; i < numCPUs; i++) {
			cluster.fork();
		}
		
		cluster.on("exit", handleWorker);
		
	} else {
		
		var app = connect();
		
//TODO: Needs to be edited and instead of using config files it should use NODE_ENV
		/*
		if(settings.environment.env === settings.environment.environments.dev) {
			app.use(connect.logger("short"));
		}*/
				
		app.use(connect.static(settings.paths.public))
			.use(connect.query())
			.use(connect.cookieParser())
			.use(connect.urlencoded())
			.use(connect.json())
			.use(connect.logger())
		   	.use(handleRequest(settings));
		
		http.createServer(app).listen(port);
		console.log("New server worker has started on port: " + port + " with id: " + cluster.worker.id);
		
	}
}

/**
 * Handles all incoming requests that weren't handled by the previous connect middleware.
 * 
 * @param settings
 * @returns {Function}
 */
function handleRequest(settings) {	
	return function(req, res, next) {
		var pathname = url.parse(req.url).pathname;
		
		console.log("Handle Request - " + pathname);
		
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
			
			console.log("Errors during handling: ");
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
			
			console.log("Get Request and Response object from controller");
			
			var request = controller.request.internal;
			var response = controller.response.internal;
			
			console.log("Check if headers are already set");
			
			// If headers are already sent than we can just end the response here.
			if(response.headersSent) {
				response.end();
			}
			
			console.log("Set cookie headers");
			
			// Need to get the Set Cookie headers first.
			if(controller.response.headers("Set-Cookie")) {
				response.setHeader("Set-Cookie", controller.response.headers("Set-Cookie"));
				delete controller.response.headers()["Set-Cookie"];
			}
			
			console.log("Set default headers");
			
			// Write headers and content than end the response.
			response.setHeader("Content-Length", controller.response.contentLength());
			response.setHeader("Content-Type", "text/html; charset=utf-8");
			response.setHeader("Server", "Manuras Framework Server");
			if(settings.server.poweredBy) controller.response.headers("X-Powered-By", "Node.js/" + process.version);
			
			console.log("Write head and body.");
			
			response.writeHead(controller.response.status(), controller.response.headers());
			response.write(controller.response.body);
			
			console.log("End response".red);
			response.end();
		});
	};
}

/**
 * Gets called when a worker dies. It'll log the event and start a new worker.
 * 
 * @param worker
 * @param code
 * @param signal
 */
function handleWorker(worker, code, signal) {
	console.log("worker " + worker.process.pid + " died");
	cluster.fork();
}

exports.start = start;