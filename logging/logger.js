/**
 * Little Logger that can log to multiple sources.
 */

var util = require("util");

var level = { 
		trace: { 
			name: "Trace",
			value: 5,
			code: "T"
		},
		debug: {
			name: "Debug",
			value: 4,
			code: "D"
		},
		info: {
			name: "Info",
			value: 3,
			code: "I"
		},
		warning: {
			name: "Warning",
			value: 2,
			code: "W"
		},
		error: {
			name: "Error",
			value: 1,
			code: "E"
		}
};

var outputString = "[%s] - [%s]: %s\n";
var outputLevel = level.debug;

var streams = [];

function write(level, message) {
	if(level.value <= outputLevel.value) {		
		for(var i = 0; i< streams.length; i++) {
			streams[i].write(util.format(outputString, now(), level.name, message));
		}
	}
}

function trace(message) {
	write(level.trace, message);
}

function debug(message) {
	write(level.debug, message);
}

function info(message) {
	write(level.info, message);
}

function warning(message) {
	write(level.warning, message);
}

function error(message) {
	write(level.error, message);
}

function addStream(stream) {
	streams.push(stream);
}

function now() {
	var date = new Date();
	var dateString = "%s-%s-%s %s:%s:%s";
	
	currSec = date.getSeconds();
	currMin = date.getMinutes();
	currHour = date.getHours();

	currDay = date.getDate();
	currMonth = date.getMonth() + 1;
	currYear = date.getFullYear();
	
	return util.format(dateString, currDay, currMonth, currYear, currHour, currMin, currSec);
	
}

exports.write = write;
exports.addStream = addStream;

exports.level = level;
exports.trace = trace;
exports.debug = debug;
exports.info = info;
exports.warning =  warning;
exports.error = error;
