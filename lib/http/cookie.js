/**
 * This file is used by the response object to manipulate the cookies.
 */

var config = require("./../config")
	, cookie = require("cookie")
	, cookieSignature = require("cookie-signature");

/**
 * Cookie constructor
 */
function Cookie(name, value, options) {
	
	this.name = name;
	this.value = value;
	
	this.options = options;
};

/**
 * Parses a string from a singed cookie to an unsigned string.
 * 
 * @param string
 * @returns unsigned string
 */
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

/**
 * Serializes the cookie.
 * 
 * @returns
 */
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

/**
 * If the cookie contains a JSON string this function will be used to parse the json.
 * 
 * @param str
 * @returns
 */
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