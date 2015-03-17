// app dependencies
var App = require('../app');
var Q = require('q');
// define module
App.module('Entities', function(Entities, App, Backbone, Marionette, $, _) {

	Entities.Setup = Entities.Setup || {};
	Entities.Setup.Model = Backbone.Model.extend({
		defaults: {
			columns: undefined //obj
		}
	});

	Entities.Setup.Collection = Backbone.Collection.extend({
		model: Entities.Setup.Model,
		parse: function(data) {
			return data['columns'];
		}
	});

	Entities.Setup.get = function(){
		return Entities.Setup.collection;
	};

	function _getSetup() {
		var defer = Q.defer();
		var models = [];
		$.getJSON(App.Constants.PATHS.JSON + 'setup.json', function(data) {
			Entities.Setup.collection = new Entities.Setup.Collection(data['columns']);
			defer.resolve(Entities.Setup.collection);
		});
		return defer.promise;
	}

	App.reqres.setHandler(App.Constants.REQRES.SETUP, _getSetup);
});

// export
module.exports = App.Entities;