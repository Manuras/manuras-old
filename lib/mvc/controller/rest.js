
var Controller = require('./')
	, View = require('./../view');

/**
 * ControllerTemplate constructor
 */
function ControllerRest() {	
	this.contentType = 'application/json';
} 

// Set Controller as the prototype so we inherit it's functionality
ControllerRest.prototype = new Controller();

/**
 * Sets the template to a view if auto rendering is true.
 */
ControllerRest.prototype.before = function(callback) {	
	callback();
};

/**
 * This function will redirect to another function. request method + Index. Example: getIndex or postIndex
 */
ControllerRest.prototype.index = function(callback) {

	var actionName = this.request.method.toLowerCase() + 'Index';

	var fn = this[actionName];

	if(typeof fn === 'function') {
		fn.call(this, callback);
	} else {
		callback({code: 404, msg: 'The REST action does not exist in the controller'});
	}
}

/**
 * Renders the view if auto rendering is set to true.
 */
ControllerRest.prototype.after = function(callback) {
	this.response.headers('Content-Type', this.contentType);
	Controller.prototype.after.call(this, callback);
};

module.exports = ControllerRest;