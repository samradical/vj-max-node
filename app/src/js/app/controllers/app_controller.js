// app dependencies
var App = require('../app');

// define module
App.module('AppController', function(AppController, App, Backbone, Marionette, $, _) {

	// controller class
	AppController.Controller = Marionette.Controller.extend({

		initialize: function() {
			// listen to events
			App.once(App.Constants.EVENTS.PRELOADED, this.preload, this);
			App.on(App.Constants.EVENTS.HASH_CHANGED, this.onHashChanged, this);
		},

		preload: function() {
			//maybe need to load assets
			this.onPreloaded();
		},

		onPreloaded: function() {
			this.createViews();
		},

		createViews: function() {
			
		},

		onHashChanged: function(params) {
			//store
			//App.Storage.addUrlParams(App.Utils.urlParams(params));
		}

	});

	// instance
	AppController.instance = new AppController.Controller();

});

// export
module.exports = App.AppController;