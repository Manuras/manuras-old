
var cluster = require('cluster')
	, logger = require('log4js').getLogger('manuras');

var NotFoundError = require('./../errors/notfound')
	, View = require('./../mvc/view');

/**
 * If the request handler has an error it will send it to the error handler and this function will handle the error.
 * It will either display a stacktrace to the client or an error page, based on the environment.
 */
function handle() {
	return function(err,req,res,next) {
		
		// Exit domain to avoid recursive error throwing by the domain. This means we handle by try/catch now.
		process.domain.exit();

		// Log the error
		logger.warn('There was an error. At this point it can still be a recoverable error.');

		// Handle error
		try {
			if(err.error instanceof NotFoundError) {	
				logger.info('The error was just a 404. Send a 404 response.');

				if(process.env.NODE_ENV === err.context.settings.app.env.prod) {
					res.writeHead(404, {'Content-Type': 'text/html'});
					res.write('404 - Page not Found');
					res.end();
				} else {
					generateErrorPage(err, res, req, function(error, result) {
						if(error) {
							fatalError(error);
						}

						res.writeHead(404, {'Content-Type': 'text/html'});
						res.write(result);
						res.end();
					});
				}
			} else {
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
					generateErrorPage(err, res, req, function(error, result) {
						if(error) {
							fatalError(error);
						}

						res.writeHead(500, {'Content-Type': 'text/html'});
						res.write(result);
						res.end();
					});
				}
			}
		} catch(err2) {
			fatalError(err2);
		}
	};
}

function generateErrorPage(err, res, req, callback) {
	var view = new View('error');

	var error = err.error;
	var stack = error.stack.split(/\n/);

	view.set('error', error);
	view.set('stack', stack);

	view.render('jade', function(error, result) {
		callback(error,result);
	});
}

function fatalError(err) {
	logger.fatal('Error while handeling an error! ;.;', err.stack);
	process.exit(1);	
}

exports.handle = handle;