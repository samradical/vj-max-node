// app dependencies
var App = require('../app');

// define module
App.module('Config', function(Config, App, Backbone, Marionette, $, _) {

	Config.controls = {};
	Config.controls.login = function() {
		App.trigger(App.Constants.CONTROLS.LOGIN_EVENT);
	},

	Config.controls.getPlaylists = function() {
		App.trigger(App.Constants.CONTROLS.GET_PLAYLISTS_EVENT);
	},

	Config.controls.filters = ["danceability", "duration", "energy", "instrumentalness", "key", "liveness", "loudness", "speechiness", "bpm", "valence"];
	Config.controls.similarArtists = true;

	Config.controls.genreLookup = {};
	Config.controls.genreLookup.top = 3;
	Config.controls.genreLookup.random = 3;

	Config.controls.playlist = {};
	Config.controls.playlist.length = 15;
	Config.controls.playlist.discovery = 50;
	Config.controls.playlist.comfortZone = 50;
	Config.controls.playlist.artistReoccuranceRate = 25;

	Config.controls.playlistTracks = {};
	Config.controls.playlistTracks.minBpm = 0;
	Config.controls.playlistTracks.maxBpm = 500;

	Config.controls.playlistTracks.minDuration = 0;
	Config.controls.playlistTracks.maxDuration = 3600;

	Config.controls.playlistTracks.minLoudness = -100;
	Config.controls.playlistTracks.maxLoudness = 100;

	Config.controls.playlistTracks.minDanceability = 0;
	Config.controls.playlistTracks.maxDanceability = 1;

	Config.controls.playlistTracks.minEnergy = 0;
	Config.controls.playlistTracks.maxEnergy = 1;

	Config.controls.playlistTracks.minLiveness = 0;
	Config.controls.playlistTracks.maxLiveness = 1;

	Config.controls.playlistTracks.minSpeechiness = 0;
	Config.controls.playlistTracks.maxSpeechiness = 1;

	Config.controls.playlistTracks.minAcousticness = 0;
	Config.controls.playlistTracks.maxAcousticness = 1;

});

// export
module.exports = App.Config;