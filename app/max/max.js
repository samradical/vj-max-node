var Q = require('q');
var fs = require('fs');
var MAX_PATH = './max-modules/';

var MAX = {
	patches: {},
	init: function() {
		var self = this;
		var defer = Q.defer();
		fs.readdir(MAX_PATH, function(err, files) {
			if (err) {
				console.log("ERROR READING MAX DIR");
				console.log(err);
			} else {
				self._storePatches(files);
			}
			defer.resolve(files);
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
			self._getMaxPatch(key).then(function(jsonPatch) {
				var boxes = jsonPatch['patcher']['boxes'];
				var requirements = [];
				console.log(boxes);
				_.each(boxes, function(obj) {
					var box = obj['box'];
					//using inlets
					var maxclass = box['maxclass'];
					if (maxclass === 'inlet') {
						if (box['varname']) {
							console.log(box['varname']);
							requirements.push(box['varname']);
						}
					}
				});
				self.patches[key]['requirements'] = requirements;
				console.log(self.patches);
			});
		}, this);
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
	},
	sender: require('./max_sender'),
};

MAX.init();

module.exports = MAX;