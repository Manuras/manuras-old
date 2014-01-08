function SettingsError(message) {
	this.name = 'Settings Error';
	this.message = message || 'There is something wrong with the settings in the config files.';
};

SettingsError.prototype = new Error();

module.exports = SettingsError;