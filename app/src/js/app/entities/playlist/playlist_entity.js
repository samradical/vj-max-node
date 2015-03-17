// app dependencies
var App = require('../../app');
var Q = require('q');
var MAX_LENGTH = 50;
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

	Entities.Playlist.init = function() {
		var models = [];
		for (var i = 0; i < MAX_LENGTH; i++) {
			models.push(new Entities.Playlist.Model());
		}
		Entities.Playlist.collection = new Entities.Playlist.Collection(models);
		App.trigger(App.Constants.EVENTS.SET_PLAYLIST, Entities.Playlist.collection);
	};

	Entities.Playlist.updateVO = function(vo) {
		//thumbnails and stuff
		var model = Entities.Playlist.collection.where({name: vo['name']})[0];
		vo['render'] = true;
		model.set(vo);
		//model.set('render', false);
	};


	Entities.Playlist.updateActiveVOs = function(activeVOs) {
		var model;
		//return;
		_.each(activeVOs, function(vo) {
			vo['render'] = false;
			model = Entities.Playlist.collection.at(vo['index']);
			model.set(vo);
		});
	};

	Entities.Playlist.setPlaylist = function(playlist) {
		//var models = [];

		_.each(playlist, function(vo, i) {
			vo['render'] = true;
			var model = Entities.Playlist.collection.at(i);
			model.set(vo);
			/*_.forIn(vo, function(value, key){
				model.set(key, value);
			});*/
			/*if(i === 0){
				console.log(model);
			}
			_.forIn(vo, function(value, key){
				model.set(key, value);
			});*/
		});
		/*_.each(playlist, function(item, i) {
			var model = Entities.Playlist.collection.at(i);

			models.push(new Entities.Playlist.Model(item));

		});
		Entities.Playlist.collection = new Entities.Playlist.Collection(models);*/
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
	Entities.Playlist.init();
	App.reqres.setHandler(App.Constants.REQRES.PLAYLIST, _getPlaylist);
});



// export
module.exports = App.Entities;