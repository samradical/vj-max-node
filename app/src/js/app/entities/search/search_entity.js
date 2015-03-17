// app dependencies
var App = require('../../app');
var Q = require('q');
// define module
App.module('Entities', function(Entities, App, Backbone, Marionette, $, _) {

	Entities.Search = Entities.Search || {};
	Entities.Search.Model = Backbone.Model.extend({
		defaults: {
			type: undefined, //obj
			active: undefined //obj
		}
	});

	Entities.Search.Collection = Backbone.Collection.extend({
		model: Entities.Search.Model,
		parse: function(data) {
			var list = [];
			//only active ones
			_.each(data['search'], function(termObj) {
				if(termObj['active']){
					list.push(termObj);
				}
			});
			return list;
		}
	});

	Entities.Search.get = function() {
		console.log(Entities.Search.collection);
		return Entities.Search.collection;
	};

	function _getSearch() {
		var defer = Q.defer();
		var models = [];
		Entities.Search.collection.url = App.Constants.PATHS.JSON + 'setup.json';
		Entities.Search.collection.fetch({
			cache: true,
			success: function() {
				console.log(0, "Search Loaded!");
				defer.resolve(Entities.Search.collection);
			}
		});
		return defer.promise;
	}
	Entities.Search.collection = new Entities.Search.Collection();
	App.reqres.setHandler(App.Constants.REQRES.SEARCH_CONFIG, _getSearch);
});

// export
module.exports = App.Entities;