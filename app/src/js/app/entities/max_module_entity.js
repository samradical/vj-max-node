// app dependencies
var App = require('../app');

// define module
App.module('Entities', function(Entities, App, Backbone, Marionette, $, _) {

	Entities.MaxModules = {
		patches: {},
		initialize: function() {
			var self = this;
			NodeServer.helper.getMaxPatchNames().then(function(files) {
				if (!files) {
					console.log("Error reading patches!");
				}
				self._storePatches(files);
			});
		},

		_storePatches: function(files) {
			_.each(files, function(name) {
				this.patches[name] = {};
			}, this);
			this._storePatchRequirements();
		},

		_storePatchRequirements: function() {
			var self = this;
			_.forIn(this.patches, function(value, key) {
				NodeServer.helper.getMaxPatch(key).then(function(jsonPatch) {
					var boxes = jsonPatch['patcher']['boxes'];
					var requirements = [];
					console.log(boxes);
					_.each(boxes, function(obj){
						var box = obj['box'];
						//using inlets
						var maxclass = box['maxclass'];
						if(maxclass === 'inlet'){
							if(box['varname']){
								console.log(box['varname']);
								requirements.push(box['varname']);
							}
						}
					});
					self.patches[key]['requirements'] = requirements;
					console.log(self.patches);
				});
			}, this);
		}
	};

	Entities.MaxModules.initialize();
});



// export
module.exports = App.Entities;