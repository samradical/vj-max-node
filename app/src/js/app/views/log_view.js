// app dependencies
var App = require('../app');
// define module
App.module('Views', function(Views, App, Backbone, Marionette, $, _) {
	Views.Log = Marionette.ItemView.extend({
		template: JST['log'],
		templateHelpers:{
			logging:""
		},
		initialize: function() {
			App.on("input:file:event", this._onLog, this);
			App.on("output:file:event", this._onLog, this);
		},
		onShow: function() {
			
		},
		_onLog:function(log){
			this.templateHelpers.logging += ("\n");
			this.templateHelpers.logging += (log);
			this.render();
		}

	});
});

// export
module.exports = App.Views;