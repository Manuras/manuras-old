/**
 * This file contains the wrapper for the node.js response object. It has additional functions build upon the original response object.
 */

function Response(res) {
	this.internal = res;
	
	this.content = "";
	this._headers = {};
	
	this._status = 200;
	this._protocol = "HTTP/1.1";
}

Response.prototype.contentLength = function() {
	return this.content.length;
};

Response.prototype.headers = function(key, value) {
	
	if(typeof key !== "undefined" && typeof key === "string") {
		
		if(typeof value !== "undefined") {
			this._headers[key] = value;
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
