
var cluster = require('cluster')
	, logger = require('log4js').getLogger('manuras');

/**
 * If the request handler has an error it will send it to the error handler and this function will handle the error.
 * It will either display a stacktrace to the client or an error page based on the environment.
 */
function handle() {
	return function(err,req,res,next) {
		
		// Log the error
		logger.warn('There was an error. At this point it can still be a recoverable error.');
		
		// Handle error
		try {
			if(err.error.code === 404) {
				logger.info('The error was just a 404. Send a 404 response.');
				
				res.writeHead(404, {'Content-Type': 'text/html'});
				
				if(process.env.NODE_ENV === err.context.settings.app.env.prod) {
					res.write('404 - Page not Found');
				} else {
					var body = '<html><head></head><body>';
					body += err.error;
					body += '</body></html>';
					
					res.write(body);			
				}
				
				res.end();
			} 
			
			logger.error('We have an error. Send 500 response and close the worker.');
		
			var killtimer = setTimeout(function() {
				process.exit(1);
			}, 5000);
		
			killtimer.unref();
			
			// Stop server from taking requests
			err.server.close();
			
			// Disconnect worker and let the master start a new worker
			cluster.worker.disconnect();
			
			// If in production send an error message to the client, else print the stack.
			if(process.env.NODE_ENV === err.context.settings.app.env.prod) {
				console.log('Generate a nice error message for the client.');
				
				res.writeHead(500, {'Content-Type': 'text/html'});
				res.write('Error 500 - We are dealing with some errors here. Don\'t worry it\'s not your fault.');
				res.end();
			} else {
				console.log('Generate a nice error message for the developer.');
				
				res.writeHead(500, {'Content-Type': 'text/html'});
				
				var body = '<html><head></head><body>';
				
				console.log();

				body += '<h1>' + err.error + '</h1><br />';
				
				if(typeof err.error.stack !== 'undefined') {
					body += '<pre>' + err.error.stack + '</pre>';
				}
				
				body += '</body></html>';
				
				res.write(body);
				res.end();	
			}
		
		} catch(err2) {
			console.error('Error while handeling an error! ;.;', err2.stack);
		}
	};
}

exports.handle = handle;