/**
 * This file contains the wrapper for the node.js request object. It has additional functions build upon the original request object.
 */

var Cookie = require("./../../http/cookie");

function Request(req) {
	this.internal = req;
	this.params = {};
	this._cookies = {};

	var cookie = new Cookie;
	
	for(var key in this.internal.cookies) {
		var parsedValue = cookie.parse(this.internal.cookies[key]);
		
		if(parsedValue) {
			this._cookies[key] = parsedValue;
		}
	}
}

Request.prototype = {
	
	cookies: function(name) {
		if(typeof name !== "undefined") {
			return this._cookies[name];
		} else {
			return this._cookies;
		}	
	},
		
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