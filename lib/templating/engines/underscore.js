
var underscore = require('underscore');

function render(str, data, callback) {
	callback({}, underscore.template(str, data));
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

exports.render = render;
exports.renderType = renderType;