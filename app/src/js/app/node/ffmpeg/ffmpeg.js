var ff = require('fluent-ffmpeg');
var Q = require('q');

var FFMPEG = {
	init: function() {
		//set FFPMEG here.
	},

	getDuration: function(path) {
		var defer = Q.defer();
		ff.ffprobe(path, function(err, metadata) {
			defer.resolve(metadata['streams'][0]['duration']);
		});
		return defer.promise;
	}
};

FFMPEG.init();


module.exports = FFMPEG;