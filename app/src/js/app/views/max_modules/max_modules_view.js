// app dependencies
var App = require('../../app');
var signals = require('signals');
// define module
App.module('Views.MaxModules', function(MaxModules, App, Backbone, Marionette, $, _) {
	MaxModules.Patch = Marionette.ItemView.extend({
		template: JST['max_patch'],
		events:{
			'click .MaxPatch-name':'_onClick'
		},
		initialize: function() {
			this.clickSignal = new signals.Signal();
		},
		onRender: function() {
			return App.Utils.renderViewAsRootEl(this);
		},

		_onClick:function(){
			this.clickSignal.dispatch(this.model.get('name'));
		},

		onDestroy:function(){
			this.clickSignal.dipose();
			this.clickSignal = null;
		}
	});

	MaxModules.Collection = Marionette.CollectionView.extend({
		childView: MaxModules.Patch,
		tagName: 'div',
		className: 'MaxModules',
		initialize:function(){
			_.bindAll(this, '_onChildClicked');
			this.changePatchSignal = new signals.Signal();
		},
		onAddChild: function(child) {
			child.clickSignal.add(this._onChildClicked);
		},
		_onChildClicked:function(patchName){
			this.changePatchSignal.dispatch(patchName);
		},
		onBeforeRemoveChild:function(child){
			child.clickSignal.remove(this._onChildClicked);
		},
		onShow:function(){
			App.Controllers.MaxModules.instance.setView(this);
		}
	});
});

// export
module.exports = App.Views.MaxModules;