var _ = require('lodash');
var iExpress = require('./express/express');
var NodeServer = {
	max: require('./max/max'),
	playlist: require('./playlist/playlist'),
	express:require('./express/express'),
	//helper: require('./helper/helper'),
	vine: require('./vine/vine')
};

//NodeServer.express = new iExpress(NodeServer);

NodeServer.max.init().then(function(patches) {
	NodeServer.playlist.setRequirements(
		patches['rad-simple.maxpat']['requirements']
	);
}).done();

NodeServer.max.sender.create('rad-simple.maxpat');

//reference
NodeServer.playlist.setNodeServer(NodeServer);
NodeServer.express.setNodeServer(NodeServer);

_.forIn(NodeServer, function(module){
	//module.ns = NodeServer;
	//console.log(module.ns);
	//console.log(NodeServer);
});


//test

//NodeServer.playlist.setRequirements(NodeServer.max.getPatches());

/*NodeServer.vine.login().then(function(user){
	NodeServer.vine.getTag('fail').then(function(results){
		console.log(results);
	});
});*/
