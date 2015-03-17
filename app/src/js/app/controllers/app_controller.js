// app dependencies
var App = require('../app');
var rivets = require('rivets');

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
			var self = this;
			App.request(App.Constants.REQRES.SETUP).then(function(setupCollection){
				self.onPreloaded();
			}).done();
			//maybe need to load assets
			//this.onPreloaded();
		},

		onPreloaded: function() {
			rivets.binders.src = function(el, value){
				el.src = value;
			};
			rivets.binders.width = function(el, value){
				el.style.width = value;
			};

			this.createViews();
		},

		createViews: function() {
			this.appView = new App.Views.App();
			App.Regions.show(App.Constants.REGIONS.APP, this.appView);
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