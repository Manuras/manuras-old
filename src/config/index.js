
var fs = require("fs")
	, path_module = require("path");

var config = {};

function loadConfig(root) {
	
	var path = path_module.join(root, "config");

	var files = fs.readdirSync(path);
	var length = files.length;
	var f;
	
	var partialConfig = {};
	
	for(var i = 0; i < length; i++) {
		
		name = files[i].replace(".js", "");
		
		var filePath = path_module.join(path, files[i]); 
		
		if(name === "settings") {
			this.config = require(filePath);
		} else {
			partialConfig[name] = require(filePath);
		}
	}
	
	for(var key in partialConfig) {
		this.config[key] = partialConfig[key];
	}
	
	return this.config;
}

function getSettings() {
	return this.config;
}

module.exports = {
	getSettings: getSettings,
	loadConfig: loadConfig
		
};
