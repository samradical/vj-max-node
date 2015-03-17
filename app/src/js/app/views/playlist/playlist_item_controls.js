// app dependencies
var App = require('../../app');
var signals = require('signals');
var LOOP_PROP = 'loops';

// define module
App.module('Views.Playlist.Controls', function(Controls, App, Backbone, Marionette, $, _) {

	Controls.Loop = Marionette.LayoutView.extend({
		template: JST['controls_loop'],
		events: {
			'click .icon-up': '_onUpClicked',
			'click .icon-down': '_onDownClicked'
		},
		initialize: function() {
			this.increaseSignal = new signals.Signal();
			this.decreaseSignal = new signals.Signal();
		},
		onRender: function() {
			return App.Utils.renderViewAsRootEl(this);
		},

		_onUpClicked: function() {
			this.increaseSignal.dispatch();
		},

		_onDownClicked: function() {
			this.decreaseSignal.dispatch();
		},

		onDestroy:function(){
			this.increaseSignal.dispose();
			this.decreaseSignal.dispose();
			this.increaseSignal = null;
			this.decreaseSignal = null;
		}
	});

	Controls.Main = Marionette.LayoutView.extend({
		template: JST['playlist_item_controls'],
		regions: {
			loopRegion: '#loop-region'
		},
		initialize: function(options) {
			this.model = options['model'];
			_.bindAll(this, '_onLoopIncrease','_onLoopDecrease');
		},
		onRender: function() {
			return App.Utils.renderViewAsRootEl(this);
		},

		onShow: function() {
			this.loop = new Controls.Loop();
			this.loop.increaseSignal.add(this._onLoopIncrease);
			this.loop.decreaseSignal.add(this._onLoopDecrease);
			this.loopRegion.show(this.loop);
		},

		/*LOOP*/

		_onLoopDecrease:function(){
			var loopVal = this.model.get(LOOP_PROP);
			loopVal--;
			loopVal = Math.max(loopVal, -1);
			var o = {
				render:true,
				loops:loopVal
			};
			this.model.set(o);
			this._dispatchModel();
		},

		_onLoopIncrease:function(){
			var loopVal = this.model.get(LOOP_PROP);
			loopVal++;
			var o = {
				render:true,
				loops:loopVal
			};
			this.model.set(o);	
			this._dispatchModel();
		},

		_dispatchModel:function(){
			App.trigger(App.Constants.EVENTS.PLAYLIST_UPDATE_VO, this.model);
		},

		onDestroy:function(){
			//this.loop.increaseSignal.remove(this._onLoopIncrease);
			//this.loop.decreaseSignal.remove(this._onLoopDecrease);
		}
	});
});

// export
module.exports = App.Views.Playlist.Controls;