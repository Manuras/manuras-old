
var ejs = require('ejs');

function render(str, data, callback) {
	console.log('Rendering with EJS');
	var compiled = ejs.compile(str);
	
	callback({}, compiled(data));
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