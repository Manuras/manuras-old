var config = require('./../config');

var BaseSession = require('./../basesession');

function CookieSession(name, root, settings) {
	BaseSession.call(this, name, root, settings);
} 

CookieSession.prototype = new BaseSession();

CookieSession.prototype._read = function(callback) {

};

CookieSession.prototype._write = function(callback) {

};

CookieSession.prototype._destroy = function(callback) {

};