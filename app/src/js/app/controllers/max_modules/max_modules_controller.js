// app
var App = require('../../app');
require('q');

App.module('Controllers', function(Controllers, App, Backbone, Marionette, $, _) {
	Controllers.MaxModules = Marionette.Controller.extend({
		setView: function(view) {
			this.view = view;
			this.view.changePatchSignal.add(this._changePatch);
			this.setCollection();
		},
		setCollection:function(){
			var self = this;
			if(!this.view){
				return;
			}
			App.request(App.Constants.REQRES.MAX_PATCHES).then(function(collection) {
				self.view.collection = collection;
				self.view.render();
			}).done();
		},
		_changePatch: function(name) {
			App.Controllers.Server.newPatch(name);
		}
	});

	Controllers.MaxModules.instance = new App.Controllers.MaxModules();
});

// export
module.exports = App.Controllers.MaxModules;