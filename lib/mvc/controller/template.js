
var Controller = require("./")
	, View = require("./../view");

/**
 * ControllerTemplate constructor
 */
function ControllerTemplate() {	
	this.template = "";
	this.autoRender = true;
}

// Set Controller as the prototype so we inherit it's functionality
ControllerTemplate.prototype = new Controller();

/**
 * Sets the template to a view if auto rendering is true.
 */
ControllerTemplate.prototype.before = function() {
	Controller.prototype.before.call();

	if(this.autoRender) {
		this.template = new View(this.template);
	}
};

/**
 * Renders the view if auto rendering is set to true.
 */
ControllerTemplate.prototype.after = function() {
	var self = this;
	
	if(this.autoRender) {
		this.template.render(function(err, data) {		
			self.response.body = data;
			Controller.prototype.after.call();
			self.callback({},self);

		});
	} else {
		Controller.prototype.after.call();
		callback({},self);
	}
};

module.exports = ControllerTemplate;