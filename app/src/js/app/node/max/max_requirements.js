var Q = require('q');
var fs = require('fs');
var _ = require('lodash');
var MAX_PATH = './max-modules/';

var MAX_REQUIREMENTS = {
	patches:{},
	getRequirements: function() {
		var self = this;
		var defer = Q.defer();
		fs.readdir(MAX_PATH, function(err, files) {
			if (err) {
				defer.resolve(undefined);
			}
			if(files[0] == '.DS_Store'){
    			files.splice(0,1);
			}
			_.each(files, function(name) {
				self.patches[name] = {};
			}, self);
			self._storePatchRequirements().then(function(patches){
				defer.resolve(patches);
			});
		});
		return defer.promise;
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
				if(counter === length){
					defer.resolve(self.patches);
				}
			});
		}, this);

		return defer.promise;
	},
	_getMaxPatch: function(name) {
		var defer = Q.defer();
		fs.readFile(MAX_PATH + name, {
			encoding: 'utf-8'
		}, function(err, data) {
			if (!err) {
				defer.resolve(JSON.parse(data));
			} else {
				console.log("Problem reading max patch!");
				console.log(err);
			}

		});
		return defer.promise;
	}
};

module.exports = MAX_REQUIREMENTS;