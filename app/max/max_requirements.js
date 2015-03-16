var Q = require('q');
var fs = require('fs');
var _ = require('lodash');
var MAX_PATH = './max-modules/';

var MAX_REQUIREMENTS = {
	patches: {},
	readfile: Q.denodeify(fs.readFile),
	readdir: Q.denodeify(fs.readdir),
	getRequirements: function() {
		var self = this;
		return this.readdir(MAX_PATH).then(function(files) {
			if (files[0] == '.DS_Store') {
				files.splice(0, 1);
			}
			var onlyMaxPats = [];
			_.each(files, function(name) {
				if (name.indexOf('.maxpat') !== -1) {
					onlyMaxPats.push(name);
					self.patches[name] = {};
				}
			});
			return self._storePatchRequirements();
		}).catch(function(err) {
			throw new Error("Failed!");
		});
	},
	_storePatchRequirements: function() {
		var length = _.keys(this.patches).length;
		var counter = 0;
		var defer = Q.defer();
		var self = this;
		_.forIn(this.patches, function(value, key) {
			self._getMaxPatch(key).then(function(jsonPatch) {
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
				counter++;
				if (counter === length) {
					//END
					defer.resolve(self.patches);
				}
			});
		}, this);
		return defer.promise;
	},
	_getMaxPatch: function(name) {
		return this.readfile(MAX_PATH + name, {
			encoding: 'utf-8'
		}).then(function(data) {
			return JSON.parse(data);
		}).catch(function(err) {
			throw new Error('Failed!');
		});
	}
};

module.exports = MAX_REQUIREMENTS;