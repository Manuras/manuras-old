var session = require('./../../session')
	, uaParser = require('ua-parser');

var Cookie = require('./../../http/cookie');

/**
 * This file contains the wrapper for the node.js request object. It has additional functions build upon the original request object.
 */
function Request(req, settings) {
	this.internal = req;
	this.settings = settings;

	this.params = {};

	this._cookies = {};
	this.method = '';
	this.protocol = '';
	this.userAgent = {};

	this.isAjax = false;

	// Set cookies in request
	var cookie = new Cookie;
	
	for(var key in this.internal.cookies) {
		var parsedValue = cookie.parse(this.internal.cookies[key]);
		
		if(parsedValue) {
			this._cookies[key] = parsedValue;
		}
	}

	// Set method data
	this.method = this.internal.method;

	// Set protocol data. Since this a HTTP server it will always be HTTP.
	this.protocol = 'HTTP/' + this.internal.httpVersion; 

	// Set user-agent data
	if(typeof this.internal.headers['user-agent'] !== 'undefined') {
		var uaResult = uaParser.parse(this.internal.headers['user-agent']);

		// Set different useragent types
		this.userAgent.browser = {};
		this.userAgent.os = {};
		this.userAgent.device = {};

		// Set the browser information
		this.userAgent.browser.string = uaResult.ua.toString();
		this.userAgent.browser.versionString = uaResult.ua.toVersionString();
		this.userAgent.browser.family = uaResult.ua.family;
		this.userAgent.browser.major = uaResult.ua.major;
		this.userAgent.browser.minor = uaResult.ua.minor;
		this.userAgent.browser.patch = uaResult.ua.patch;

		// Set the Operating System information
		this.userAgent.os.string = uaResult.os.toString();
		this.userAgent.os.versionString = uaResult.os.toVersionString();
		this.userAgent.os.family = uaResult.os.family;
		this.userAgent.os.major = uaResult.os.major;
		this.userAgent.os.minor = uaResult.os.minor;
		this.userAgent.os.patch = uaResult.os.patch;

		// Set device information
		this.userAgent.device = uaResult.device.family;
	}

	// Check if request is ajax
	if(typeof this.internal.headers['x-requested-with'] !== 'undefined' && this.internal.headers['x-requested-with'] === 'XMLHttpRequest') {
		this.isAjax = true;
	}

	//console.log(this.internal);
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

	/**
	 *
	 */
	session: function(name) {
		var sessionSettings = {};

		if(typeof name === 'undefined') {
			name = 'default';
		}

		sessionSettings = this.settings.session[name];

		session.instance(sessionSettings.name, sessionSettings.driver, function(err,driver) {
			console.log(err);
			console.log(driver);
		});
	},
};

module.exports = Request;