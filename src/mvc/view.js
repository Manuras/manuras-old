
var engine = require("./../templating/engine");
var config = require("./../config");

function View(file, internal) {
	this.file = file;
	this.internal = internal || false;
	
	this.data = {};
	this.settings = config.getSettings();
}

View.prototype.set = function(key, value) {
	this.data[key] = value;
};

View.prototype.render = function(templateEngine, callback) {
	
	if(typeof callback === "undefined") {
		callback = templateEngine;
		templateEngine = this.settings.templating.engine;
	}
	
	engine.render(this.file, this.data, templateEngine, function(err, data) {
		callback(err,data);
	});
};
	
module.exports = View;