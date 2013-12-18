var Constraint = require('./constraint');

function Length(operator, value) {
	this.operator = operator;
	this.value = value;
	
	this.message = 'The length has to be :operator than :value';
}

Length.prototype = new Constraint();

Length.prototype.validate = function(key, data, callback) {
	
	var result = false;
	
	switch(this.operator) {
		case '>':
			result = data[key].length > this.value;
			break;
		case '<':
			result = data[key].length < this.value;
			break;
		case '=':
		case '==':
		case '===':
			result = data[key].length === this.value;
			break;
		case '>=':
			result = data[key].length >= this.value;
			break;
		case '<=':
			result = data[key].length >= this.value;
			break;
		default:
			var message = 'The operator ( ' + this.operator + ' ) is not supported';
			callback({type: 'length', msg: message});
	}
	
	if(result) {
		callback(null);
	} else {
		var message = this.message.replace(':operator', this.operator);
		message = message.replace(':value', this.value);
		callback({type: 'length', msg: message});
	}
};

module.exports = Length;