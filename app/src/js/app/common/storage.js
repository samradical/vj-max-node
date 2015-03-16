// app dependencies
var App = require('../app');

// define module
App.module('Storage', function(Storage, App, Backbone, Marionette, $, _) {
	_.extend(Storage, {
		appPlaylistWidth:undefined
	});
});

// export
module.exports = App.Storage;