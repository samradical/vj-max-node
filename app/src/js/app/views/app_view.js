// app dependencies
var App = require('../app');
var COL_CLASS = "ColumnRegion";
// define module
App.module('Views', function(Views, App, Backbone, Marionette, $, _) {
	Views.App = Marionette.ItemView.extend({
		layoutRegions: [],
		template: JST['app'],
		onRender: function() {
			return App.Utils.renderViewAsRootEl(this);
		},
		onShow: function() {
			this._setup();
		},


		/*creates all the regions and columns*/
		_setup: function() {
			var setupCollection = App.Entities.Setup.get();
			var buffer = [];
			setupCollection.each(function(model, i) {
				model.set('index', i);
				var el = document.createElement('div');
				el.className += COL_CLASS;
				el.id = 'column-' + i + '-region';
				var style = model.get('style');
				_.forIn(style, function(val, key) {
					el.style[key] = val;
				});
				buffer.push(el);
			}, this);
			this.$el.append(buffer);


			var regions = this.$el.find('.' + COL_CLASS);
			_.each(regions, function(el, i) {
				var region = App.Constants.REGIONS['COLUMN_' + i] = "";
				App.Regions.add(App.Constants.REGIONS['COLUMN_' + i], '#' + el.id);
				this.layoutRegions.push(new Views.Column({
					model: setupCollection.at(i)
				}));
				App.Regions.show(region, this.layoutRegions[i]);
			}, this);
		},

		_createViews: function() {
			var setupCollection = App.Entities.Setup.get();
			var buffer = [];
			setupCollection.each(function(model, i) {
				var el = document.createElement('div');
				el.className += COL_CLASS;
				el.id = 'column-' + i + '-region';
				var style = model.get('style');
				_.forIn(style, function(val, key) {
					el.style[key] = val;
				});
				buffer.push(el);
			}, this);
			this.$el.append(buffer);


			var regions = this.$el.find('.' + COL_CLASS);
			_.each(regions, function(el, i) {
				var region = App.Constants.REGIONS['COLUMN_' + i] = "";
				App.Regions.add(App.Constants.REGIONS['COLUMN_' + i], '#' + el.id);
				this.layoutRegions.push(new Views.Column());
				App.Regions.show(region, this.layoutRegions[i]);
			}, this);



			return;

			this.maxModuleView = new App.Views.MaxModules.Collection();
			App.Controllers.MaxModules.instance.setView(this.maxModuleView);
			App.Regions.show(App.Constants.REGIONS.MAX_MODULE, this.maxModuleView);


			this.playlistView = new App.Views.Playlist.Collection();
			App.Controllers.Playlist.instance.setView(this.playlistView);
			App.Regions.show(App.Constants.REGIONS.PLAYLIST, this.playlistView);

		},

		_createColumnEl: function() {
			var el = document.createElement('div');
		}

	});
});

// export
module.exports = App.Views;