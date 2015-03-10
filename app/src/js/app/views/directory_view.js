// app dependencies
var App = require('../app');
// define module
App.module('Views', function(Views, App, Backbone, Marionette, $, _) {
	Views.Directory = Marionette.ItemView.extend({
		template: JST['directory'],
		templateHelpers:{
			logging:""
		},
		initialize: function(options) {
			this.callback = options.callback;
			App.on('log:event', this._onLog, this);
		},
		onShow: function() {
			/*var self = this;
			this.$inputEl = $('#fileDialog');
			this.$inputEl.on('change', function(e){
				App.trigger("input:file:event", $(this).val());
			});*/
			this.$output = $('#outputDirectory');
			this.$output.on('change', function(e){
				App.trigger("output:file:event", $(this).val(), self.callback);
			});
			//this.$inputEl.click();
		}
	});
});

// export
module.exports = App.Views;