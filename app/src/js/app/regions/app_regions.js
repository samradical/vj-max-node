// app dependencies
var App = require('../app');

// define module
App.module('Regions', function(Regions, App, Backbone, Marionette, $, _) {

	// region manager class
	Regions.RegionManager = Marionette.RegionManager.extend({

		initialize: function() {
			// define regions
			var data = {};
			data[App.Constants.REGIONS.CONTROLS] = '#controls-region';
			data[App.Constants.REGIONS.SEARCH] = '#search-region';
			data[App.Constants.REGIONS.RESPONSE] = '#response-region';
			this.addRegions(data);
		}

	});

	// helpers
	Regions.showInRegion = function(regionId, view) {
		if (!view) return;
		var region = Regions.instance.get(regionId);
		if (region) {
			region.show(view);
		}
	};

	// instance
	Regions.instance = new Regions.RegionManager();

});

// export
module.exports = App.Regions;