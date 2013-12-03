var Cookie = require("./../../http/cookie");

/**
 * This file contains the wrapper for the node.js response object. It has additional functions build upon the original response object.
 */
function Response(res) {
	this.internal = res;
	
	this.body = "";
	this._headers = {};
	
	this._status = 200;
	this._protocol = "HTTP/1.1";
}

/**
 * Returns the content length of the current body.
 * @returns
 */
Response.prototype.contentLength = function() {
	return this.body.length;
};

Response.prototype.cookie = function(name, val, options) {
	var cookie = new Cookie(name,val,options);
	this.headers("Set-Cookie", cookie.serialize());
};

Response.prototype.headers = function(key, value) {
	
	if(typeof key !== "undefined" && typeof key === "string") {
		
		if(typeof value !== "undefined") {
		
			// Set Cookie can have multiple headers, so we need to handle it a little different
			if(key === "Set-Cookie") {
				if(typeof this._headers[key] === "undefined") {
					this._headers[key] = [];
				}
				
				this._headers[key].push(value);
			} else {
				this._headers[key] = value;
			}
		}
			
		return this._headers[key];
		
	} else if(typeof key !== "undefined" && key !== null && Object.prototype.toString.call(key) == "[object Object]") {
		
		for(var name in key) {
			this._headers[name] = key[name];
		}
		
	} else {
		return this._headers;
	}
};

// This function doesn't work yet
/*
Response.prototype.protocol = function(protocol) {
	if(typeof protocol !== "undefined" && protocol !== null) {
		this._protocol = protocol;
	} else {
		return this._protocol;
	}
};
*/

Response.prototype.status = function(code) {
	if(typeof code !== "undefined" && code !== null) {
		this._status = code;
	} else {
		return this._status;
	}
};

module.exports = Response;
