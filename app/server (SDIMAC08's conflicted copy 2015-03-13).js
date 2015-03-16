var iExpress = require('./express/express');
var NodeServer = {
	max: require('./max/max'),
	playlist: require('./playlist/playlist'),
	helper: require('./helper/helper'),
	vine: require('./vine/vine')
};

NodeServer.express = new iExpress(NodeServer);

NodeServer.max.init().then(function(patches) {
	NodeServer.playlist.setRequirements(
		patches['rad-simple.maxpat']['requirements']
	);
}).done();

NodeServer.max.sender.create('rad-simple.maxpat');


//test

//NodeServer.playlist.setRequirements(NodeServer.max.getPatches());

/*NodeServer.vine.login().then(function(user){
	NodeServer.vine.getTag('fail').then(function(results){
		console.log(results);
	});
});*/
