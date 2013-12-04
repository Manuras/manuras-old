
console.log("Worker started.");
console.log("Worker waiting for message from server.");

process.on('message', function(message) {
	
	console.log("Message received. Let's start the server.");
	
});

var autoloader = require("./server/autoloader")
	, config = require("./../config") 
	, server = require("./../server");

var routes = {
		home:
			{ 
				route: "/",
				controller: "home:index"
			},
		user: 
			{
				route: "/user/{id}/{action}",
				controller: "user:show",
				//defaults: { id: 1 }
			},
		ejs:
			{
				route: "/ejs",
				controller: "templateEngines:ejs"
			},
		jade:
			{
				route: "/jade",
				controller: "templateEngines:jade"
			},
		mustache:
			{
				route: "/mustache",
				controller: "templateEngines:mustache"
			},
		underscore:
			{
				route: "/underscore",
				controller: "templateEngines:underscore"
			}
};

var settings = config.loadConfig();

autoloader.loadControllers(path.join(root, settings.paths.controllers));
router.compile(autoloader.controllers, routes);

templateEngine.loadEngines(root);

requestHandler = new RequestHandler(router);