var config = require('./../config')
	, crypto = require('crypto');

var ConfigError = require('./../errors/config');

var settings = {};
var algorithm = '';

/**
 * This function initializes the encryption functions
 */
function init(root) {
	settings = config.getSettings();

	algorithm = settings.encryption.algorithm;
	var supportedAlgorithms = crypto.getCiphers();

	if(supportedAlgorithms.indexOf(algorithm) === -1) {
		throw new ConfigError('The given algorithm ( ' + algorithm + ' ) in the config file is not supported.');
	}
}

/**
 * This function encrypts that data and sends it back with a callback.
 */
function encrypt(data, callback) {
	if(typeof data === 'string') {
		data = new Buffer(data);
	}
 
	var iv = crypto.randomBytes(16);
	var cipher = crypto.createCipheriv(algorithm, settings.encryption.key, iv);

	var encryptedData = cipher.update(data, '', settings.encryption.outputEncoding) + cipher.final(settings.encryption.outputEncoding);
	
	callback(null,iv.toString(settings.encryption.outputEncoding) + '#' + encryptedData);
};

/**
 * This function decrypts encrypted data and returns the plain text in the callback.
 */
function decrypt(data, callback) {
	var parts = data.split('#');

	var iv = new Buffer(parts[0], settings.encryption.outputEncoding);
	var content = new Buffer(parts[1], settings.encryption.outputEncoding);

	var decipher = crypto.createDecipheriv(algorithm, settings.encryption.key, iv);

	var decryptedData = decipher.update(content, '', settings.app.encoding) + decipher.final(settings.app.encoding);

	callback(null,decryptedData);
};

exports.init = init;
exports.encrypt = encrypt;
exports.decrypt = decrypt;