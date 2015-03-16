// app dependencies
var App = require('../../app');
var Q = require('q');

// define module
App.module('Entities', function(Entities, App, Backbone, Marionette, $, _) {

	Entities.MaxModules.Model = Backbone.Model.extend({
		defaults: {
			name: '',
			requirements: undefined
		}
	});

	Entities.MaxModules.Collection = Backbone.Collection.extend({
		model: Entities.MaxModules.Model,
		initialize: function() {},
		parse: function(data) {
			console.log(data);
		}
	});

	/*Entities.MaxModules.Fetcher.get().then(function(patches) {
		var models = [];
		_.forIn(patches, function(value, key) {
			var model = new Entities.MaxModules.Model({
				name: key,
				requirements: value['requirements']
			});
			models.push(model);
		});
		Entities.MaxModules.collection = new Entities.MaxModules.Collection(models);
	});*/

	function _getPatchPatches() {
		var defer = Q.defer();
		if(Entities.MaxModules.collection){
			defer.resolve(Entities.MaxModules.collection);
			return;
		}
		Entities.MaxModules.Fetcher.get().then(function(patches) {
			var models = [];
			_.forIn(patches, function(value, key) {
				var model = new Entities.MaxModules.Model({
					name: key,
					requirements: value['requirements']
				});
				models.push(model);
			});
			Entities.MaxModules.collection = new Entities.MaxModules.Collection(models);
			defer.resolve(Entities.MaxModules.collection);
		}).done();
		return defer.promise;
	}

	App.reqres.setHandler(App.Constants.REQRES.MAX_PATCHES, _getPatchPatches);
});



// export
module.exports = App.Entities;