// app
var App = require('../../app');
require('q');

App.module('Controllers', function(Controllers, App, Backbone, Marionette, $, _) {
	Controllers.Playlist = Marionette.Controller.extend({
		collection:undefined,
		initialize: function() {
			console.log(0, "playlistController");
			//from playlist_entity
			App.on(App.Constants.EVENTS.SET_PLAYLIST, this.setCollection, this);
			//from playlist controls
			App.on(App.Constants.EVENTS.PLAYLIST_UPDATE_VO, this.updateServerVO, this);
		},
		setView: function(view) {
			this.view = view;
			if(this.collection){
				this.view.collection = this.collection;
				this.view.render();
			}
		},
		setCollection: function(collection) {
			this.collection = collection;
			if(this.view){
				this.view.collection = this.collection;
			}
		},


		updateServerVO:function(model){
			var vo = model.toJSON();
			if(IS_APP){
				Controllers.Server.updateVO(vo);
			}else{
				Controllers.Socket.updateVO(vo);
			}
		}
				/*App.request(App.Constants.REQRES.PLAYLIST).then(function(collection) {
					self.view.collection = this.collection;
					self.view.render();
				}).done();*/
	});

	Controllers.Playlist.instance = new App.Controllers.Playlist();
});

// export
module.exports = App.Controllers.Playlist;