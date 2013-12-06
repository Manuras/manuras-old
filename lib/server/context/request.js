var Cookie = require('./../../http/cookie');

/**
 * This file contains the wrapper for the node.js request object. It has additional functions build upon the original request object.
 */
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
	
	/**
	 * Contains all the cookies send by the client.
	 * 
	 * @param name
	 * @returns
	 */
	cookies: function(name) {
		if(typeof name !== 'undefined') {
			return this._cookies[name];
		} else {
			return this._cookies;
		}	
	},
		
	/**
	 * Contains all the optional parameters from the route.
	 * 
	 * @param name
	 * @returns
	 */
	param: function(name) {
		if(typeof name !== 'undefined') {
			return this.params[name];
		} else {
			return this.params;
		}
	},
	
	/**
	 * Contains all the post variables send by the client. aka POST
	 * 
	 * @param name
	 * @returns
	 */
	post: function(name) {
		if(typeof name !== 'undefined') {
			return this.internal.body[name];
		} else {
			return this.internal.body;
		}
	},
		
	/**
	 * Contains all the query variables send by the client. aka GET
	 * 
	 * @param name
	 * @returns
	 */
	query: function(name) {
		if(typeof name !== 'undefined') {
			return this.internal.query[name];
		} else {
			return this.internal.query;
		}
	},
	
};

module.exports = Request;