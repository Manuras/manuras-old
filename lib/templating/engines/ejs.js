var logger = require('log4js').getLogger('manuras');

var engine;

function render(str, data, callback) {
	
	var ejs = engine || (engine = require('ejs'));
	
	var compiled = ejs.compile(str);
	callback(null, compiled(data));
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
 * This function returns if the rederer has caching support
 * 
 * @returns {Boolean}
 */
function caches() {
	return false;
}

exports.render = render;
exports.renderType = renderType;