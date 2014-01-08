var config = require('./../config')
	, crypto = require('crypto');

var SettingsError = require('./../errors/settings');

/**
 * Class to handle encryption and decryption of data. Uses the settings file for configuration.
 */
function Encrypt() {
	this.settings = config.getSettings();

	this.algorithm = this.settings.encryption.algorithm;
	var supportedAlgorithms = crypto.getCiphers();

	if(supportedAlgorithms.indexOf(this.algorithm) === -1) {
		throw new SettingsError('The given algorithm ( ' + this.algorithm + ' ) in the config file is not supported.');
	}
}

/**
 * This function encrypts that data and sends it back with a callback.
 */
Encrypt.prototype.encrypt = function(data, callback) {
	var self = this;

	if(typeof data === 'string') {
		data = new Buffer(data);
	}
 
	var iv = crypto.randomBytes(16);
	var cipher = crypto.createCipheriv(self.algorithm, self.settings.encryption.key, iv);

	var encryptedData = cipher.update(data, '', self.settings.encryption.outputEncoding) + cipher.final(self.settings.encryption.outputEncoding);
	
	callback(null,iv.toString(self.settings.encryption.outputEncoding) + '#' + encryptedData);
};

/**
 * This function decrypts encrypted data and returns the plain text in the callback.
 */
Encrypt.prototype.decrypt = function(data, callback) {
	var self = this;	

	var parts = data.split('#');

	var iv = new Buffer(parts[0], self.settings.encryption.outputEncoding);
	var content = new Buffer(parts[1], self.settings.encryption.outputEncoding);

	var decipher = crypto.createDecipheriv(self.algorithm, self.settings.encryption.key, iv);

	var decryptedData = decipher.update(content, '', self.settings.app.encoding) + decipher.final(self.settings.app.encoding);

	callback(null,decryptedData);
};

module.exports = Encrypt;