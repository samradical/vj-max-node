var ff = require('fluent-ffmpeg');
var Q = require('q');
var config = require('../playlist/playlist_config');

var FFMPEG = {
	init: function() {
		//set FFPMEG here.
	},

	videoPrep: function(vo) {
		//
		return Q.all([this._getThumbnail(vo), this._getDuration(vo)]).then(function(arrResponse) {
			return arrResponse[1];
		});
	},

	_getThumbnail: function(vo) {
		var dest = config.THUMB_DESTINATION;
		var defer = Q.defer();
		ff(vo['absolutePath'])
			.on('error', function() {
				vo['thumbnailAbsolutePath'] = dest + 'default.jpg';
				vo['thumbnailPath'] = 'default.jpg';
			})
			.on('end', function() {
				vo['thumbnailAbsolutePath'] = dest + vo['name'] + '.jpg';
				vo['thumbnailPath'] = vo['name'] + '.jpg';
				defer.resolve(vo);
			})
			.screenshots({
				timestamps: ['50%'],
				filename: vo['name'] + '.jpg',
				folder: dest,
				size: '140x105'
			});
		return defer.promise;
	},

	_getDuration: function(vo) {
		var defer = Q.defer();
		ff.ffprobe(vo['absolutePath'], function(err, metadata) {
			vo['duration'] = 3; //default 3secs
			if (metadata) {
				vo['duration'] = metadata['streams'][0]['duration'];
				vo['timeRemaining'] = vo['duration'];
			}
			defer.resolve(vo);
		});
		return defer.promise;
	}
};

FFMPEG.init();


module.exports = FFMPEG;