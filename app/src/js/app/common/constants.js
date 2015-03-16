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

		PATHS:{
			JSON:'assets/json/',
			IMAGES:'assets/img/'
		},

		EVENTS:{
			PRELOADED:'events:preloaded',

			KEYWORD_SEARCH:'events:keyword:search',
			SET_PLAYLIST:'events:set:playlist'
		},

		REGIONS: {
			APP: 'app',

			MAX_MODULE:"max-module",
			PLAYLIST:"playlist"
		},

		REQRES: {
			PLAYLIST: 'reqres:playlist',
			MAX_PATCHES: 'reqres:maxpatches'
		}
	});

});

// export
module.exports = App.Constants;