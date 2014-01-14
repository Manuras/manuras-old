var config = require('./../config')
	, encrypt = require('./../encrypt')
	, moment = require('moment');

function BaseSession(name, root, req, res, settings) {
	this.name = (name !== 'undefined' ? name : 'session');
	this.id = null;
	this.root = root;
	this.request = req;
	this.response = res;
	this.settings = settings;

	this.destroyed = false;
	this.data = {};
}

BaseSession.prototype.set = function(key, value, callback) {
	this.data[key] = value;
	callback(null,this);
};

BaseSession.prototype.get = function(key, callback) {
	key in this.data ? callback(null,this.data[key]) : callback(null,null);
};

BaseSession.prototype.delete = function(key, callback) {
	delete this.data[key];
	callback(null,this);
};

BaseSession.prototype.destroy = function(callback) {
	if(this.destroyed === false) {
		this._destroy(this.response, function(err) {
			if(err) {
				return(callback(err));
			} else {
				this.destroyed = true;
				callback(null,this.destroyed);
			}
		});
	} else {
		callback(null,this.destroyed);
	}
};

BaseSession.prototype.read = function(callback) {
	var self = this;

	this._read(this.request, function(err, data) {
		
		if(err) {
			return(callback(err));
		}

		if(self.settings.session.encrypt) {
			encrypt.decrypt(data, function(err,data) {
				if(err) {
					return(callback(err));
				}

				self.data = self.unserialize(data);
				callback(null);
			});
		} else {
			self.data = self.unserialize(data);
			callback(null);
		}
	});
};

BaseSession.prototype.write = function(callback) {
	if(this.response.headersSent) {
		callback(new Error('Headers already sent, cannot write the session.'));
	}

	if(Object.keys(this.data).length > 0) {
		this.data.last_active = moment().format();

		this._write(this.response, function(err) {
			callback(err);
		});
	} else {
		callback(null);
	}
};

BaseSession.prototype.name = function() {
	return this.name;
};

BaseSession.prototype.id = function() {
	return this.id;
}

BaseSession.prototype.serialize = function(data) {
	return JSON.stringify(data);
};

BaseSession.prototype.unserialize = function(data) {
	return JSON.parse(data);
};

BaseSession.prototype.toString = function(callback) {
	var serializedData = this.serialize(this.data);

	if(this.settings.session.encrypt) {
		encrypt.encrypt(serializedData, function(err,data) {
			callback(err,data);
		});
	} else {
		callback(null,serializedData);
	}
};

module.exports = BaseSession;