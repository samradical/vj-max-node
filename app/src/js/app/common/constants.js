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
			/*PLAYLIST*/
			SET_PLAYLIST:'events:set:playlist',
			PLAYLIST_UPDATE_VO:'events:playlist:update:vo'
		},

		REGIONS: {
			APP: 'app',

			MAX_MODULE:"max-module",
			PLAYLIST:"playlist"
		},

		REQRES: {
			SETUP: 'reqres:setup',
			PLAYLIST: 'reqres:playlist',
			MAX_PATCHES: 'reqres:maxpatches'
		}
	});

});

// export
module.exports = App.Constants;