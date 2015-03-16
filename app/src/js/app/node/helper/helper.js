var fs = require('fs');
var Q = require('q');
var MAX_PATH = './max-modules/';

var HELPER = {
	/*getMaxPatchNames: function() {
		var defer = Q.defer();
		fs.readdir(MAX_PATH, function(err, files) {
			if (err) {
				defer.resolve(undefined);
			}
			defer.resolve(files);
		});
		return defer.promise;
	},
	getMaxPatch: function(name) {
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
	}*/
};

module.exports = HELPER;