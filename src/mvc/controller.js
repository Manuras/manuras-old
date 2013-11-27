/**
 * This file contains the basic functionalities of the handler. This file must be required in order to make a file handleable.
 */

function Controller(req, res) {
	this.request = req;
	this.response = res;
	
	this.callback = "";
	this.content = "";
}
	
Controller.prototype.before = function() {
	
};

Controller.prototype.action = function() {
	
};

Controller.prototype.redirect = function(url, code) {
	this.response.internal.writeHead(code, { "Location": url });
	this.callback(this, {});
};
	
module.exports = Controller;