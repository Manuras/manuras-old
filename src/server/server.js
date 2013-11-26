/**
 * New node file
 */
var http = require('http');
var url = require("url");

function start(router, port, logger) {
	
	function onRequest(request, response) {
		 var pathname = url.parse(request.url).pathname;
		
		logger.info("A request on: " + pathname);
	
		router.handle(pathname, request, response);
	}
	
	http.createServer(onRequest).listen(port);
	logger.write(logger.level.info, "Server has started.");
}

exports.start = start;