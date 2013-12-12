var logger = require('log4js').getLogger('manuras');

var cache = {};

var engine;

function render(str, data, callback) {
	var jade = engine || ( engine = require('jade'));
	
	if(typeof cache[str] !== 'undefined') {
		logger.trace("View is cached");
		callback(null, cache[str](data));
	} else {
		logger.trace("View is not cached");
		
		var fn = jade.compile(str);
		cache[str] = fn;
		
		callback(null, fn(data));
	}
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
	return ['html', 'jade'];
}

/**
 * 
 * This function returns if the renderer has caching support
 * 
 * @returns {Boolean}
 */
function caches() {
	return true;
}

exports.extensions = extensions;
exports.render = render;
exports.renderType = renderType;