// app
var App = require('../../app');
require('q');

App.module('Controllers', function(Controllers, App, Backbone, Marionette, $, _) {
	Controllers.Search = Marionette.Controller.extend({
		initialize:function(){
			App.on(App.Constants.EVENTS.SEARCH_VINE_TAG, this._onVineTagSearch, this);
		},
		setView: function(view) {
			this.view = view;
			this.setCollection();
		},
		setCollection:function(){
			var self = this;
			if(!this.view){
				return;
			}
			App.request(App.Constants.REQRES.SEARCH_CONFIG).then(function(collection) {
				self.view.collection = collection;
				self.view.render();
			}).done();
		},
		_onVineTagSearch:function(term){
			//TODO
			if(IS_APP){
				//Controllers.Server.(vo);
			}else{
				//Controllers.Socket.updateVO(vo);
			}
		}
	});

	Controllers.Search.instance = new App.Controllers.Search();
});

// export
module.exports = App.Controllers.Search;