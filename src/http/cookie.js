/**
 * This file is used by the response object to manipulate the cookies.
 */

var config = require("./../config")
	, cookie = require("cookie")
	, sign = require("cookie-signature").sign;

function Cookie(name, value, options) {
	
	this.name = name;
	this.value = value;
	
	this.options = options;
	
};

Cookie.prototype.toString = function() {
	
	var settings = config.getSettings();
	var secret = settings.cookie.secret;
	
	if(!secret) {
		throw new Error("Secret needs to be set in the config file.");
	}
	
	if(typeof this.value === "number") this.value = this.value.toString();
	if(typeof this.value === "object") this.value = "j:" + JSON.stringify(this.value);
	
	this.value = sign(this.value, secret);
	
	if ('maxAge' in this.options) {
		this.options.expires = new Date(Date.now() + options.maxAge);
		this.options.maxAge /= 1000;
	  }
	
	if (null == this.options.path) this.options.path = '/';
	
	return cookie.serialize(this.name, String(this.value), this.options);
};

module.exports = Cookie;