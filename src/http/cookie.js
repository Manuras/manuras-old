/**
 * This file is used by the response object to manipulate the cookies.
 */

var config = require("./../config")
	, cookie = require("cookie")
	, cookieSignature = require("cookie-signature");

function Cookie(name, value, options) {
	
	this.name = name;
	this.value = value;
	
	this.options = options;
};

Cookie.prototype.parse = function(string) {
	var unsignedCookie = cookieSignature.unsign(string, settings.cookie.secret);
	
	if(0 == unsignedCookie.indexOf('j:')) {
		try {
			return JSON.parse(unsignedCookie.slice(2));
		} catch (err) {
			// no op
		}
	}
	
	return unsignedCookie;
};

Cookie.prototype.serialize = function() {
	
	var settings = config.getSettings();
	var secret = settings.cookie.secret;
	
	if(!secret) {
		throw new Error("Secret needs to be set in the config file.");
	}
	
	if(typeof this.value === "number") this.value = this.value.toString();
	if(typeof this.value === "object") this.value = "j:" + JSON.stringify(this.value);
	
	this.value = cookieSignature.sign(this.value, secret);
	
	if ('maxAge' in this.options) {
		this.options.expires = new Date(Date.now() + options.maxAge);
		this.options.maxAge /= 1000;
	  }
	
	if (null == this.options.path) this.options.path = '/';
	
	return cookie.serialize(this.name, String(this.value), this.options);
};

function parseJSONCookie(str) {
	if (0 == str.indexOf('j:')) {
		try {
			return JSON.parse(str.slice(2));
		} catch (err) {
			// no op
		}
	}
}

module.exports = Cookie;