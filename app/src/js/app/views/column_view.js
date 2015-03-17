// app dependencies
var App = require('../app');
var COL_VIEW_CLASS = 'ColumnViewRegion';
// define module
App.module('Views', function(Views, App, Backbone, Marionette, $, _) {
	Views.Column = Marionette.LayoutView.extend({
		columIndex: undefined,
		template: JST['column'],
		initialize: function(options) {
			this.model = options['model'];
			this.columIndex = this.model.get('index');
		},
		onRender: function() {
			return App.Utils.renderViewAsRootEl(this);
		},
		onShow: function() {
			this._createRegions();
			this._createViews();
		},
		_createRegions: function() {
			var views = this.model.get('views');
			var buffer = [];
			/*
			
			columnIndex then the view index
			
			*/
			//each view gets its own region
			_.each(views, function(name, i) {
				var el = document.createElement('div');
				el.className += COL_VIEW_CLASS;
				el.id = 'columnview-' + this.columIndex + '-' + i + '-region';
				buffer.push(el);
			}, this);
			this.$el.append(buffer);

			//now we add these els as regions
			var regions = this.$el.find('.' + COL_VIEW_CLASS);
			//not the view index
			_.each(regions, function(el, i) {
				var region = App.Constants.REGIONS['COLUMN_VIEW_' + this.columIndex + '_' + i] = "";
				App.Regions.add(App.Constants.REGIONS['COLUMN_VIEW_' + this.columIndex + '_' + i], '#' + el.id);
			}, this);
		},

		_createViews: function() {
			var views = this.model.get('views');
			_.each(views, function(viewObj, i) {
				var view = new App.Views[viewObj['module']][viewObj['package']]();
				App.Regions.show(App.Constants.REGIONS['COLUMN_VIEW_' + this.columIndex + '_' + i], view);
			}, this);
		}

	});
});

// export
module.exports = App.Views;