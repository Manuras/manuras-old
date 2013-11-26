/**
 * New node file
 */

var routes = {};

function compile(rawRoutes) {
	
	for(var name in rawRoutes) {

		routes[name] = {};
		
		for(var key in rawRoutes[name]) {	
			if(key === "route" && rawRoutes[name][key]) {		
				
				// Get Optionals from route			
				rawOptionals = rawRoutes[name][key].split(/{(.*?)}/);
				optionals = {};
				
				for(var i = 0; i < rawOptionals.length; i++) {
					if(rawOptionals[i] !== "" && rawOptionals[i].indexOf("/") === -1) {
						optionals[rawOptionals[i]] = 1;
					}
				}
				
				routes[name]["optionals"] = optionals;
				
				// Generate regex from rout
				
				regex = rawRoutes[name][key].replace(/{([^}]*)\}/g, "([^/.,;?]*)");
				
				routes[name]["regex"] = regex; 				
			}	
		}
	}
	
	
	console.log(routes);
}

function handle(pathname, request, response) {
	response.end();
}

exports.compile = compile;
exports.handle = handle;
