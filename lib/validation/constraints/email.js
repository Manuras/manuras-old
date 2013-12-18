var Constraint = require('./constraint');

function Email() {
	this.message = 'The value is not a valid email address.';
	this.regex = /[a-z0-9!#$%&'*+\/=?^_{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/i;
}

Email.prototype = new Constraint();

Email.prototype.validate = function(key, data, callback) {
	
	var result = this.regex.test(data[key]);
	
	if(result) {
		callback(null);
	} else {
		callback({type: 'regex', msg: this.message});
	}
};

module.exports = Email;