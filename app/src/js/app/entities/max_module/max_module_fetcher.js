// app dependencies
var App = require('../../app');
var Q = require('q');
// define module
App.module('Entities', function(Entities, App, Backbone, Marionette, $, _) {
	Entities.MaxModules = Entities.MaxModules || {};
	Entities.MaxModules.Fetcher = {
		patches: {},
		get: function() {
			var defer = Q.defer();
			var self = this;
			if (IS_APP) {
				return NodeServer.max.getPatches();
			} else {
				this._readPatches(defer);
			}	
			return defer.promise;
		},

		//----------
		//FRONT END
		//----------

		_readPatches: function(defer) {
			var patches = ['rad-chroma-layer-merge-xfade.maxpat',
				'rad-chroma-layer-subtract.maxpat',
				'rad-simple.maxpat'
			];
			_.each(patches, function(name) {
				this.patches[name] = {};
			}, this);
			this._storePatchRequirementsTemp(defer);
		},

		_storePatchRequirementsTemp: function(defer) {
			var self = this;
			var count = 0;
			var length = _.values(this.patches).length;
			_.forIn(this.patches, function(value, key) {
				$.getJSON(App.Constants.PATHS.JSON + 'max-modules/' + key, function(jsonPatch) {
					var boxes = jsonPatch['patcher']['boxes'];
					var requirements = [];
					_.each(boxes, function(obj) {
						var box = obj['box'];
						//using inlets
						var maxclass = box['maxclass'];
						if (maxclass === 'inlet') {
							if (box['varname']) {
								requirements.push(box['varname']);
							}
						}
					});
					self.patches[key]['requirements'] = requirements;
					count++;
					if(count === length){
						defer.resolve(self.patches);
					}
				});
			}, this);
		}
	};
});



// export
module.exports = App.Entities;