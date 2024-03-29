/**
 * Server for the Manuras Framework. Uses Connect to create the app and handle all incoming requests.
 */

var connect = require('connect')
	, domain = require('domain')
	, http = require('http')
	, log4js = require('log4js')
	, url = require('url');

var config = require('./../config')
	, requestHandler = require('./requestHandler')
	, errorHandler = require('./errorHandler');

/**
 * Sets up the correct connect middleware and setup a requesthandler to handle incoming request.
 * 
 * @param context
 * @param port
 */
function start(context, port) {

	var logger = log4js.getLogger('manuras');
	logger.info('Starting HTTP Server on Worker');
	
	var app = connect();
	
	logger.debug('Setting up middleware');
	
	app.use(connect.static(context.settings.paths.public))
		.use(connect.query())
		.use(connect.cookieParser())
		.use(connect.urlencoded())
		.use(connect.json())
	   	.use(requestHandler.handler(context))
		.use(errorHandler.handle());
	
	logger.debug('Creating Server');
	var server = http.createServer(app);
	
	logger.debug('Set Server for requestHandler. Start server.');
	requestHandler.setServer(server, function() {
		server.listen(port);
	});
}

exports.start = start;