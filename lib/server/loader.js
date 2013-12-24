var logger = require('log4js').getLogger();

function Loader(locations) {
	this.locations = locations;
}

Loader.prototype.load = function(name, callback) {
	locations.forEach(function(location) {
		console.log(location);
	});
};

module.exports = Loader;
