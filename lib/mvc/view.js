
var engine = require('./../templating/engine');
var config = require('./../config');

/**
 * View constructor
 */
function View(file) {
	this.file = file;
	
	this.data = {};
	this.settings = config.getSettings();
}

/**
 * Sets a data field which will be used in the view template.
 * 
 * @param key
 * @param value
 */
View.prototype.set = function(key, value) {
	this.data[key] = value;
};

/**
 * Renders the view based on the template engine. Will load the data into a callback.
 * 
 * @param templateEngine
 * @param callback
 */
View.prototype.render = function(templateEngine, callback) {
	if(typeof callback === 'undefined') {
		callback = templateEngine;
		templateEngine = this.settings.templating.engine;
	}

	engine.render(this, templateEngine, function(err, data) {
		callback(err,data);
	});
};
	
module.exports = View;