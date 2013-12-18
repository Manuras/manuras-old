var Constraint = require('./constraint');

function Regex(regex) {
	this.regex = regex;
	
	if(typeof this.regex === 'string') {
		this.regex = new RegExp(this.regex);
	}
	
	this.message = 'The value doesn\'t match the regex: :regex';
}

Regex.prototype = new Constraint();

Regex.prototype.validate = function(key, data, callback) {
	
	var result = this.regex.test(data[key]);
	
	if(result) {
		callback(null);
	} else {
		var message = this.message.replace(':regex', this.regex.toString());
		callback({type: 'regex', msg: message});
	}
};

module.exports = Regex;