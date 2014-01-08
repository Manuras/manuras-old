var config = require('./../config');

function BaseSession(name, root, settings) {
	this.name = (name !== 'undefined' ? name : 'session'); 
	this.root = root;
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
		this._destroy(function(err) {
			if(err) {
				callback(err);
			} else {
				this.destroyed = true;
				callback(null,this.destroyed);
			}
		});
	} else {
		callback(null,this.destroyed);
	}
};

BaseSession.prototype.name = function() {
	return this.name;
};

BaseSession.prototype.serialize = function(data) {
	return JSON.stringfy(data);
};

BaseSession.prototype.unserialize = function(data) {
	return JSON.parse(data);
};

BaseSession.prototype.toString = function() {

};



module.exports = BaseSession;