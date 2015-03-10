// app dependencies
var App = require('../app');

// define module
App.module('Constants', function(Constants, App, Backbone, Marionette, $, _) {

	_.extend(Constants, {
		REDIRECT_URI:"http://localhost:8888/callback",
		CONTROLS:{
			LOGIN_EVENT:"controls:login:event",
			GET_PLAYLISTS_EVENT:"controls:get:playlists:event"
		},


		EVENTS:{
			PRELOADED:'events:preloaded',

			KEYWORD_SEARCH:'events:keyword:search'
		},

		REGIONS: {
			CONTROLS: 'controls',
			SEARCH: 'search',
			RESPONSE: 'response'
		},

		REQRES: {
			SAVE_PLAYLISTS: 'entities:save:playlists',
			SAVE_PLAYLIST_TRACKS: 'entities:save:playlists:tracks',
			SAVE_TINYSONG: 'entities:save:tinysong'
		}
	});

});

// export
module.exports = App.Constants;