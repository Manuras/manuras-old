var Constraint = require('./constraint');

function Required() {
	this.message = 'The value :key is required.';
}

Required.prototype = new Constraint();

Required.prototype.validate = function(key, data, callback) {
	
	console.log('validate');
	
	if(typeof data[key] !== 'undefined') {
		callback(null);
	} else {
		var message = this.message.replace(':key', key);
		callback({type: 'required', msg: message});
	}
};

module.exports = Required;