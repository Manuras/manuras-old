var cache = {};
var engine;

function render(path, str, data, callback) {
	var jade = engine || ( engine = require('jade'));

	if(typeof cache[path] !== 'undefined') {
		callback(null, cache[path](data));
	} else {
		try {
			var fn = jade.compile(str);
			cache[path] = fn;
		
			callback(null, fn(data));
		} catch(err) {
			callback(err);
		}
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