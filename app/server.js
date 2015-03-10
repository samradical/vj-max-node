var iExpress = require('./express/express');
var NodeServer = {
	express: new iExpress(NodeServer),
	max: require('./max/max'),
	helper: require('./helper/helper'),
	vine: require('./vine/vine')
};


//test

NodeServer.vine.login().then(function(user){
	NodeServer.vine.getPopular().then(function(results){
		//console.log(results);
	});
});