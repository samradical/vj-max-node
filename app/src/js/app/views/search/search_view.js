// app dependencies
var App = require('../../app');
var signals = require('signals');
var rivets = require('rivets');
var DEFAULTS = ['email', 'password', 'vine tag'];
// define module
App.module('Views.Search', function(Search, App, Backbone, Marionette, $, _) {

	Search.Vine = Marionette.ItemView.extend({
		template: JST['search_item_vine'],
		inputs: undefined,
		rivetsModel: {
			vineEmail: DEFAULTS[0],
			vinePassword: DEFAULTS[1],
			vineTag: DEFAULTS[2]
		},
		events: {
			'click .js-login': '_onLogin',
			'click .js-tag': '_onTag',
			'input input': '_onInputChanged',
			'input input': '_onInputChanged',
			'focusin input': '_onInputFocusIn',
			'focusout input': '_onInputFocusOut'
		},
		initialize: function() {},
		onRender: function() {
			return App.Utils.renderViewAsRootEl(this);
		},
		onShow: function() {
			this.inputs = this.$el.find('.SearchItem-input');
			this.binder = rivets.bind(this.el, {
				model: this.rivetsModel
			});
		},

		_onLogin: function() {

		},

		_onTag: function() {
			if(this.rivetsModel.vineTag === DEFAULTS[2]){
				return;
			}
			
			console.log(this.rivetsModel.vineTag);
		},

		_onInputChanged: function(e) {
			console.log(this.rivetsModel.vineEmail);
		},
		_onInputFocusIn: function(e) {
			if (this._canEmptyDefault(e.target)) {
				e.target.value = "";
			}
		},
		_onInputFocusOut: function(e) {
			var indexOf = this.inputs.index(e.target);
			if (e.target.value === "") {
				e.target.value = DEFAULTS[indexOf];
			}
		},

		_canEmptyDefault: function(target) {
			var can = false;
			_.each(DEFAULTS, function(defaultz) {
				if (target.value === defaultz) {
					can = true;
				}
			});
			return can;
		},

		onDestroy: function() {
			this.rivetsModel = null;
			if (this.binder) {
				this.binder.unbind();
				this.binder = null;
			}
		}
	});

	Search.Youtube = Marionette.ItemView.extend({
		template: JST['search_item_youtube'],
		events: {},
		initialize: function() {},
		onRender: function() {
			return App.Utils.renderViewAsRootEl(this);
		},

		_onClick: function() {},

		onDestroy: function() {}
	});

	Search.Type = Marionette.LayoutView.extend({
		isActive: false,
		template: JST['search_item'],
		events: {
			'click .SearchItem-main': '_onClick'
		},
		initialize: function() {},
		onRender: function() {
			return App.Utils.renderViewAsRootEl(this);
		},

		onShow: function() {
			this.addRegion('controlsRegion', '#controls-region');
			var type;
			//match for the classes
			switch (this.model.get('type')) {
				case 'vine':
					type = 'Vine';
					break;
				case 'youtube':
					type = 'Youtube';
					break;
			}
			this.controls = new Search[type]({
				model: this.model
			});
			this.controlsRegion.show(this.controls);
		},

		_onClick: function() {
			this._toggleControls();
		},

		_toggleControls: function() {
			if (!this.isActive) {
				this.$el.addClass('is-active');
			} else {
				this.$el.removeClass('is-active');
			}
			this.isActive = !this.isActive;
		},

		onDestroy: function() {}
	});

	Search.Collection = Marionette.CollectionView.extend({
		childView: Search.Type,
		tagName: 'div',
		className: 'Search',
		initialize: function() {},
		onAddChild: function(child) {},
		_onChildClicked: function(patchName) {},
		onBeforeRemoveChild: function(child) {},
		onShow: function() {
			App.Controllers.Search.instance.setView(this);
		}
	});
});

// export
module.exports = App.Views.Search;