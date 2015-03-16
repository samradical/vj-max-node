var Q = require('q');
var request = require('request');
var fs = require('fs');
var config = require('./playlist_config');
var youtubeDL = require('ytdl-core');

var videoDownloader = {
	download: function(videoVO, dest) {
		var url = videoVO['url'];
		var name = videoVO['name'];
		dest = dest || config.DESTINATION;
		var method;
		switch (videoVO['type']) {
			case 'vine':
				method = this._vine;
				break;
			case 'youtube':
				method = this._youtube;
				break;
		}
		return method(url, dest, name, videoVO);
	},

	_vine: function(url, dest, name, vo) {
		var defer = Q.defer();
		request(url).pipe(fs.createWriteStream(dest + name + ".mp4")).on('finish', function() {
			vo['absolutePath'] = dest + name + ".mp4";
			//static video folder
			vo['path'] = name + ".mp4";
			defer.resolve(vo);
		});
		return defer.promise;
	},


	_youtube: function(url, dest, name, vo) {
		var defer = Q.defer();
		youtubeDL(url, {
				quality: config.YOUTUBE_QUALITY
			})
			.on('error', function(e) {
				console.log("Error!!!");
				console.log(e);
			})
			.pipe(fs.createWriteStream(dest + name + ".mp4")).on('finish', function() {
				vo['absolutePath'] = dest + name + ".mp4";
				//static video folder
				vo['path'] = name + ".mp4";
				defer.resolve(vo);
			});
		return defer.promise;
	}
};

module.exports = videoDownloader;