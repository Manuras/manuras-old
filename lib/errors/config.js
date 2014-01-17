function ConfigError(message) {
	this.name = 'Config Error';
	this.message = message || 'There is something wrong with the settings in the config files.';
};

ConfigError.prototype = new Error();

module.exports = ConfigError;