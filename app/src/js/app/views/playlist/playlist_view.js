// app dependencies
var App = require('../../app');
var signals = require('signals');
var THUMB_WIDTH = 106;
var THUMB_HEIGHT = 140;
// define module
App.module('Views.Playlist', function(Playlist, App, Backbone, Marionette, $, _) {
	Playlist.Patch = Marionette.ItemView.extend({
		progressEl: undefined,
		template: JST['playlist_item'],
		templateHelpers: {
			thumbSrc: undefined
		},
		events: {
			'click .MaxPatch-name': '_onClick'
		},
		initialize: function() {
			this.clickSignal = new signals.Signal();
			this.model.on('change', this._onModelChange, this);
			var img = this.model.get('thumbnailPath') || 'default.jpg';
			this.templateHelpers.thumbSrc = App.Constants.PATHS.IMAGES + img;
		},

		onRender: function() {
			return App.Utils.renderViewAsRootEl(this);
		},

		onShow: function() {
			this.progressEl = this.$el.find('.PlaylistItem-progress')[0];
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
			if (this.progressEl) {
				this.progressEl.style.width = this._calcProgressElWidth() + 'px';
			}
		},

		_onClick: function() {
			this.clickSignal.dispatch(this.model.get('name'));
		},

		onDestroy: function() {
			if (!this.clickSignal) {
				return;
			}
			this.clickSignal.dispose();
			this.clickSignal = null;
		}
	});

	Playlist.Collection = Marionette.CollectionView.extend({
		childView: Playlist.Patch,
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
		onRender: function() {
			App.Storage.appPlaylistWidth = this.$el.width();
		}
	});
});

// export
module.exports = App.Views.Playlist;