var engine;

function render(path, str, data, callback) {
	var underscore = engine || (engine = require('underscore'));
	callback(null, underscore.template(str, data));
}

/**
 * 
 * This function returns the rendertype as string.
 * The rendertype is the type of input the renderer needs to render the template,
 *  
 *  These are the possible rendertypes
 *  - string
 *  - file
 * 
 * @returns {String}
 */
function renderType() {
	return 'string';
}

/**
 * 
 * This function returns the possible extensions the template engine has to look for.
 * 
 * @returns {Array}
 */
function extensions() {
	return ['html'];
}

/**
 * 
 * This function returns if the rederer has caching support
 * 
 * @returns {Boolean}
 */
function caches() {
	return false;
}

exports.extensions = extensions;
exports.render = render;
exports.renderType = renderType;