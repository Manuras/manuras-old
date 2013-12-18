
var async = require('async')
	, config = require('./../config')
	, logger = require('log4js').getLogger('manuras');

function Validation() {
	this.settings = config.getSettings();
	this.constraints = {};
}

Validation.prototype.addConstraint = function(key, constraint) {
	if(typeof this.constraints[key] === 'undefined') {
		this.constraints[key] = [];
	}
	
	this.constraints[key].push(constraint);
};

Validation.prototype.validate = function(data, callback) {
	
	var constraintCount = 0;
	var doneCount = 0;
	
	var validateResults = [];
	
	for(var key in this.constraints) {
		this.constraints[key].forEach(function() {
			constraintCount++;
		});	
	}

	for(var key in this.constraints) {
		this.constraints[key].forEach(function(constraint) {
			constraint.validate(key, data, function(err) {
				err !== null && validateResults.push(err);
				doneCount++;
				
				if(constraintCount === doneCount) {
					callback(validateResults);
				}
			});
		});
	}	
};

Validation.prototype.constraint = require('./constraints');

module.exports = Validation;
