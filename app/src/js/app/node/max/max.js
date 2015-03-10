var Q = require('q');
var fs = require('fs');
var _ = require('lodash');
//var MAX_PATH = './max-modules/';

var MAX = {
	patches: {},
	requirements:require('./max_requirements'),
	init: function() {
		var defer = Q.defer();
		var self = this;
		this.requirements.getRequirements().then(function(patchesRequirements){
			self.patches = patchesRequirements;
			defer.resolve(self.patches);
		});
		return defer.promise;
	},
	/*getPatches:function(){
		var patches;
		if(!_.isEmpty(this.patches)){
			patches = this.patches;
		}else{
			var hasLoaded = false;
			while(!hasLoaded){
				if(!_.isEmpty(this.patches)){
					patches = this.patches;
					hasLoaded = true;
				}
			}
		}
		return patches;
	},*/
	sender: require('./max_sender')
};

module.exports = MAX;