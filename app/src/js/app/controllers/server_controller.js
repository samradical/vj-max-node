// app
var App = require('../app');
require('q');

App.module('Controllers', function(Controllers, App, Backbone, Marionette, $, _) {
	Controllers.Server = {
		newPatch:function(name){
			NodeServer.max.newPatch(name);
		}
	};
});

// export
module.exports = App.Controllers.Server;