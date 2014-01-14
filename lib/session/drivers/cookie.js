var moment = require('moment');

var BaseSession = require('./../basesession');

function CookieSession(name, root, req, res, settings) {
	BaseSession.call(this, name, root, req, res, settings);
} 

CookieSession.prototype = new BaseSession();

CookieSession.prototype._read = function(req, callback) {
	callback(null, req.cookies(this.name));
};

CookieSession.prototype._write = function(res, callback) {
	var self = this;

	this.toString(function(err,data) {
		if(err) {
			return(callback(err));
		}

		var lifetime = self.settings.session.lifetime;
		var momentExpire = new Date(moment().add('s', lifetime).format()); 

		res.cookie(self.name, data, { expires: momentExpire });
		callback(null);
	});
};

CookieSession.prototype._destroy = function(res, callback) {
	res.cookie(this.name, null, { maxAge: -86400 });
	callbac(null);
};

module.exports = CookieSession;