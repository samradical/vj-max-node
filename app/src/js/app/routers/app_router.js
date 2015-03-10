// app dependencies
var App = require('../app');

// define module
App.module('AppRouter', function(AppRouter, App, Backbone, Marionette, $, _) {

	// router class
	AppRouter.Router = Marionette.AppRouter.extend({

		routes: {
			'': 'onHashChanged',
			'callback': 'onHashChanged',
			'success': 'onHashChanged'
		},

		initialize: function() {
			// listen to events
			App.once(App.Constants.EVENTS.START_ROUTER, this.start, this);
		},

		start: function(root) {
			Backbone.history.start({
				pushState: true,
				root: root
			});
		},

		navigate: function(fragment, reload) {
			if (reload) {
				document.location = BASE_PATH + fragment;
			} else {
				Backbone.history.navigate(fragment, {
					trigger: true
				});
			}
		},

		onHashChanged: function() {
			console.log("hash changed");
			var params = arguments[arguments.length - 1];
			console.log(params);
			//console.log(App.Utils.urlParams(params));
			//App.trigger(App.Constants.EVENTS.HASH_CHANGED, params);
		}

	});
	// instance
	AppRouter.instance = new AppRouter.Router();

});

// export
module.exports = App.AppRouter;
