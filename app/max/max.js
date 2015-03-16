var Q = require('q');
var fs = require('fs');
var _ = require('lodash');
//var MAX_PATH = './max-modules/';

var MAX = {
	patches: {},
	requirements:require('./max_requirements'),
	init: function() {
		return this._getRequirements();
	},
	getPatches:function(){
		if(this.patches){
			return Q(this.patches);
		}
		return this._getRequirements();
	},
	_getRequirements:function(){
		var self = this;
		return this.requirements.getRequirements().then(function(patchesRequirements){
			self.patches = patchesRequirements;
			return self.patches;
		}).catch(function(err){
			console.log(err);
		});
	},
	newPatch:function(name){
		this.sender.create(name);
	},
	sender: require('./max_sender')
};

module.exports = MAX;