/**
 * This file contains the basic functionalities of the controller. This file must be required in order to make a file handleable.
 */

/**
 * Constroller constructer
 */
function Controller() {
	this.request = {};
	this.response = {};
	
	this.callback = '';
}

/**
 * Runs before the action will run.
 */
Controller.prototype.before = function(callback) {
	callback();
};

/**
 * Runs after the action has run.
 */
Controller.prototype.after = function(callback) {
	callback();
};

/**
 * Redirect the client to a new URL.
 * 
 * @param url
 * @param code
 */
Controller.prototype.redirect = function(url, code) {
	this.response.internal.writeHead(code, { 'Location': url });
	this.callback(null, this);
};
	
module.exports = Controller;