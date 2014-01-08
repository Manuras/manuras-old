var cache = {};
var engine;

function render(path, str, data, callback) {
	var ejs = engine || (engine = require('ejs'));

	if(typeof cache[path] !== 'undefined') {
		callback(null, cache[path](data));
	} else {
		try {
			var fn = ejs.compile(str);
			cache[path] = fn;
		
			callback(null, fn(data));
		} catch(err) {
			callback(err);
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
	return ['html'];
}

/**
 * 
 * This function returns if the rederer has caching support
 * 
 * @returns {Boolean}
 */
function caches() {
	return true;
}

exports.extensions = extensions;
exports.render = render;
exports.renderType = renderType;