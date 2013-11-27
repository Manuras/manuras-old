/**
 * This file contains the wrapper for the node.js response object. It has additional functions build upon the original response object.
 */

function Response(res) {
	this.internal = res;
	
	this.content = "";
}

module.exports = Response;
