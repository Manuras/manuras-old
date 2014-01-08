function RouteError(message) {
	this.name = 'Route Error';
	this.message = message || 'There is something wrong with the routes';
};

RouteError.prototype = new Error();

module.exports = RouteError;
