// app
var App = require('../../app');
require('q');

App.module('Controllers', function(Controllers, App, Backbone, Marionette, $, _) {
	Controllers.Playlist = Marionette.Controller.extend({
		collection:undefined,
		initialize: function() {
			console.log(0, "playlistController");
			App.on(App.Constants.EVENTS.SET_PLAYLIST, this.setCollection, this);
		},
		setView: function(view) {
			this.view = view;
			if(this.collection){
				this.setCollection();
			}
		},
		setCollection: function(collection) {
			var self = this;
			this.collection = collection || this.collection;
			if (!this.view) {
				return;
			}
			if (this.collection) {
				self.view.collection = this.collection;
				self.view.render();
			} else {
				App.request(App.Constants.REQRES.PLAYLIST).then(function(collection) {
					self.view.collection = this.collection;
					self.view.render();
				}).done();
			}
		}
	});

	Controllers.Playlist.instance = new App.Controllers.Playlist();
});

// export
module.exports = App.Controllers.Playlist;