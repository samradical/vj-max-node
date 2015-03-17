// app dependencies
var App = require('../app');
var Q = require('q');
// define module
App.module('Entities', function(Entities, App, Backbone, Marionette, $, _) {

	Entities.Column = Entities.Column || {};
	Entities.Column.Model = Backbone.Model.extend({
		defaults: {
			columns: undefined //obj
		}
	});

	Entities.Column.Collection = Backbone.Collection.extend({
		model: Entities.Column.Model,
		parse: function(data) {
			return data['columns'];
		}
	});

	Entities.Column.get = function() {
		return Entities.Column.collection;
	};

	function _getColumn() {
		var defer = Q.defer();
		var models = [];
		Entities.Column.collection.url = App.Constants.PATHS.JSON + 'setup.json';
		Entities.Column.collection.fetch({
			cache: true,
			success: function() {
				console.log(0, "Column Loaded!");
				defer.resolve(Entities.Column.collection);
			}
		});
		return defer.promise;
	}
	Entities.Column.collection = new Entities.Column.Collection();
	App.reqres.setHandler(App.Constants.REQRES.COLUMN_CONFIG, _getColumn);
});

// export
module.exports = App.Entities;