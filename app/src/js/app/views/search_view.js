// app dependencies
var App = require('../app');
// define module
App.module('Views', function(Views, App, Backbone, Marionette, $, _) {
	Views.Search = Marionette.ItemView.extend({
		template: JST['search'],
		templateHelpers:{
		},
		initialize: function(options) {
		},
		onShow: function() {
			this.$inputEl = this.$el.find('input');
			this.$el.on('keyup', this._onKeyUp.bind(this));
		},
		_onKeyUp:function(e){
			if(e.keyCode === 13){
				App.trigger(App.Constants.EVENTS.KEYWORD_SEARCH, this.$inputEl.val());
			}
		}
	});
});

// export
module.exports = App.Views;