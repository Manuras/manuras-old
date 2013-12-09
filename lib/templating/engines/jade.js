		
var jade = require('jade');
var extension = '.html';

function render(str, data, callback) {
	callback({}, jade.renderFile(str + extension, data));
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
	return 'file';
}

exports.render = render;
exports.renderType = renderType;