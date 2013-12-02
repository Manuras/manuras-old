/**
 * This file contains the wrapper for the node.js request object. It has additional functions build upon the original request object.
 */

function Request(req) {
	this.internal = req;
	this.params = {};
}

Request.prototype = {
	
	param: function(name) {
		if(typeof name !== "undefined") {
			return this.params[name];
		} else {
			return this.params;
		}
	},
		
	post: function(name) {
		if(typeof name !== "undefined") {
			return this.internal.body[name];
		} else {
			return this.internal.body;
		}
	},
		
	query: function(name) {
		if(typeof name !== "undefined") {
			return this.internal.query[name];
		} else {
			return this.internal.query;
		}
	},
	
};

module.exports = Request;