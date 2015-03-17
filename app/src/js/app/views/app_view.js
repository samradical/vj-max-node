// app dependencies
var App = require('../app');
// define module
App.module('Views', function(Views, App, Backbone, Marionette, $, _) {
	Views.App = Marionette.ItemView.extend({
		template: JST['app'],
		onRender: function() {
			return App.Utils.renderViewAsRootEl(this);
		},
		onShow: function() {
			this._setupRegions();

			this._createViews();
		},
		_setupRegions: function() {
			App.Regions.add(App.Constants.REGIONS.MAX_MODULE, '#max-module-region');
			App.Regions.add(App.Constants.REGIONS.PLAYLIST, '#playlist-region');
		},

		_createViews: function() {
			this.maxModuleView = new App.Views.MaxModules.Collection();
			App.Controllers.MaxModules.instance.setView(this.maxModuleView);
			App.Regions.show(App.Constants.REGIONS.MAX_MODULE, this.maxModuleView);


			this.playlistView = new App.Views.Playlist.Collection();
			App.Controllers.Playlist.instance.setView(this.playlistView);
			App.Regions.show(App.Constants.REGIONS.PLAYLIST, this.playlistView);

		}

	});
});

// export
module.exports = App.Views;