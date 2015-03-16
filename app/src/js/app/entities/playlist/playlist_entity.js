// app dependencies
var App = require('../../app');
var Q = require('q');

// define module
App.module('Entities', function(Entities, App, Backbone, Marionette, $, _) {

	Entities.Playlist = Entities.Playlist || {};
	Entities.Playlist.Model = Backbone.Model.extend({
		defaults: {
			url: undefined,
			absolutePath: undefined,
			path: undefined,
			absoluteThumbnailPath: undefined,
			thumbnailPath: undefined,
			type: undefined,
			name: undefined,
			loops: undefined,
			duration: undefined,
			timeRemaining: undefined,
			playbackRate: undefined,
			userVideo: undefined,
			active: undefined
		}
	});

	Entities.Playlist.Collection = Backbone.Collection.extend({
		model: Entities.Playlist.Model
	});

	Entities.Playlist.setActiveVOs = function(activeVOs) {
		var model;
		_.each(activeVOs, function(vo) {
			model = Entities.Playlist.collection.at(vo['index']);
			model.set('timeRemaining', vo['timeRemaining']);
		});
	};

	Entities.Playlist.setPlaylist = function(playlist) {
		var models = [];
		_.each(playlist, function(item) {
			models.push(new Entities.Playlist.Model(item));
		});
		/*if (!Entities.Playlist.collection) {
			_.each(playlist, function(item) {
				models.push(new Entities.Playlist.Model(item));
			});
			Entities.Playlist.collection = new Entities.Playlist.Collection(models);
		} else {
			_.each(playlist, function(item, index) {
				models.push(new Entities.Playlist.Model(item));
			});
			Entities.Playlist.collection.set(models, {
				add: false
			});
		}*/
		Entities.Playlist.collection = new Entities.Playlist.Collection(models);
		App.trigger(App.Constants.EVENTS.SET_PLAYLIST, Entities.Playlist.collection);
	};

	function _getPlaylist() {
		var defer;
		if (Entities.Playlist.collection) {
			return Q(Entities.Playlist.collection);
		}
		if (IS_APP) {

		} else {
			defer = Q.defer();
			var models = [];
			$.getJSON(App.Constants.PATHS.JSON + 'playlist.json', function(data) {
				_.each(data, function(item) {
					var model = new Entities.Playlist.Model(item);
					models.push(model);
				});
				Entities.Playlist.collection = new Entities.Playlist.Collection(models);
				defer.resolve(Entities.Playlist.collection);
			});
		}
		return defer.promise;
	}
	App.reqres.setHandler(App.Constants.REQRES.PLAYLIST, _getPlaylist);
});



// export
module.exports = App.Entities;