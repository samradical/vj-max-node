// app
var App = require('../app');
require('q');

App.module('Controllers', function(Controllers, App, Backbone, Marionette, $, _) {
	Controllers.Server = Marionette.Controller.extend({
		initialize: function() {
			/*this.service = require('../services/server');
			this.service.init();*/
			var FFMPEG_SERVER = FFMPEG_SERVER || null;
			if (FFMPEG_SERVER) {
				FFMPEG_SERVER.init();
			}
			App.on("input:file:event", this._onFileChosen, this);
			App.on("output:file:event", this._onFolderChosen, this);
			App.on(App.Constants.EVENTS.KEYWORD_SEARCH, this._doMix, this);
		},

		_doMix: function(keywords) {
			var k = keywords.split(",");
			FFMPEG_SERVER.start(k, 10, 'liked', {
				outputDuration: 2,
				searchPrecision: 6,
				segmentDurationMin: 0.03,
				segmentDurationMax: 0.05,
				videoDurationMax:5
			});
		},
 
		_onFileChosen: function(path) {
			FFMPEG_SERVER.setInput(path);
		},

		_onFolderChosen: function(path, callback) {
			console.log(callback);
			FFMPEG_SERVER.setOutput(path);
			FFMPEG_SERVER.encode(callback);
		}
	});
});

// export
module.exports = new App.Controllers.Server();