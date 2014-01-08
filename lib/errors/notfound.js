function NotFoundError(message) {
	this.name = 'NotFound Error';
	this.message = message || 'The requested URL was not found.';
};

NotFoundError.prototype = new Error();

module.exports = NotFoundError;