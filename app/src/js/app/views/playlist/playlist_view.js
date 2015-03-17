// app dependencies
var App = require('../../app');
var signals = require('signals');
var rivets = require('rivets');
var THUMB_WIDTH = 106;
var THUMB_HEIGHT = 140;
// define module
App.module('Views.Playlist', function(Playlist, App, Backbone, Marionette, $, _) {

	Playlist.Item = Marionette.LayoutView.extend({
		videoDuration:undefined,
		videoTimeRemaining:undefined,
		rivetsModel: undefined,
		isActive: false,
		controls: undefined,
		progress: undefined,
		progressEl: undefined,
		regions: {
			controlsRegion: '#controls-region'
		},
		template: JST['playlist_item'],
		templateHelpers: {
			thumbSrc: undefined
		},
		events: {
			'click img': '_onClick',
			'click .PlaylistItem-progress': '_onClick',
			'mouseover .PlaylistItem': '_onMouseOver',
			'mouseout .PlaylistItem': '_onMouseOut'
		},
		initialize: function() {
			this.clickSignal = new signals.Signal();
			this.model.on('change', this._onModelChange, this);
			var img = this.model.get('thumbnailPath') || 'default.jpg';
			this.rivetsModel = this.model.toJSON();
			this.rivetsModel.thumbSrc = App.Constants.PATHS.IMAGES + img;
			this.rivetsModel.progress = this._calcProgressElWidth() + 'px';
		},

		onRender: function() {
			this.binder = rivets.bind(this.el, {
				model: this.rivetsModel
			});
			this.progressEl = this.$el.find('.PlaylistItem-progress')[0];
			this._createControls();
		},

		onShow: function() {},

		_createControls: function() {
			this.controls = new Playlist.Controls.Main({
				model: this.model
			});
			this.controlsRegion.show(this.controls);
		},

		_calcTimePercent: function() {
			var tr = this.model.get('timeRemaining');
			var dur = this.model.get('duration');
			var per = tr / dur;
			per = isNaN(per) ? 1 : per;
			return per;
		},

		_calcProgressElWidth: function() {
			var max = App.Storage.appPlaylistWidth - THUMB_WIDTH;
			return max - max * this._calcTimePercent();
		},

		_onModelChange: function() {
			this.videoTimeRemaining = this.model.get('timeRemaining');
			this.videoDuration = this.model.get('duration');
			
			var img = this.model.get('thumbnailPath') || 'default.jpg';
			_.forIn(this.model.toJSON(), function(val, key){
				this.rivetsModel[key] = val;
			}, this);

			this.rivetsModel.thumbSrc = App.Constants.PATHS.IMAGES + img;
			this.rivetsModel.progress = this._calcProgressElWidth() + 'px';
		},

		_onClick: function() {
			this._toggleControls();
		},

		_onMouseOver: function(e) {

		},

		_onMouseOut: function(e) {

		},

		_toggleControls: function() {
			if (!this.isActive) {
				this.$el.addClass('is-active');
			} else {
				this.$el.removeClass('is-active');
			}
			this.isActive = !this.isActive;
		},

		onDestroy: function() {
			this.progressEl = null;
			this.rivetsModel = null;
			if (this.binder){
				this.binder.unbind();
				this.binder = null;
			} 
			this.clickSignal.dispose();
			this.clickSignal = null;
		}
	});

	Playlist.Collection = Marionette.CollectionView.extend({
		childView: Playlist.Item,
		tagName: 'div',
		className: 'Playlist',
		initialize: function() {
			_.bindAll(this, '_onChildClicked');
			this.changePatchSignal = new signals.Signal();
		},
		onAddChild: function(child) {
			child.clickSignal.add(this._onChildClicked);
		},
		_onChildClicked: function(patchName) {
			this.changePatchSignal.dispatch(patchName);
		},
		onBeforeRemoveChild: function(child) {
			child.clickSignal.remove(this._onChildClicked);
		},
		onShow: function() {
			App.Storage.appPlaylistWidth = this.$el.width();
		}
	});
});

// export
module.exports = App.Views.Playlist;