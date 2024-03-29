
var Controller = require('./')
	, View = require('./../view');

/**
 * ControllerTemplate constructor
 */
function ControllerTemplate() {	
	this.template = '';
	this.autoRender = true;
} 

// Set Controller as the prototype so we inherit it's functionality
ControllerTemplate.prototype = new Controller();

/**
 * Sets the template to a view if auto rendering is true.
 */
ControllerTemplate.prototype.before = function() {	
	if(this.autoRender) {
		this.template = new View(this.template);
	}
};

/**
 * Renders the view if auto rendering is set to true.
 */
ControllerTemplate.prototype.after = function(callback) {
	var self = this;
	
	if(this.autoRender) {		
		this.template.render(function(err, data) {
			if(err === null) {
				self.response.body = data;
				Controller.prototype.after.call(this, callback);
			} else {
				callback(err,this);
			}
		});
	} else {
		Controller.prototype.after.call(this, callback);
	}
};

module.exports = ControllerTemplate;