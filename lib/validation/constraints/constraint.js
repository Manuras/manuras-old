
function Constraint() {
	this.message = '';
}

Constraint.prototype.setMessage = function(message) {
	this.message = message;
};

module.exports = Constraint;