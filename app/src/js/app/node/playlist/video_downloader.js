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
		var defer = Q.defer();
		switch (videoVO['type']) {
			case 'vine':
				this._vine(url, dest, name, videoVO, defer);
				break;
			case 'youtube':
				this._youtube(url, dest, name, videoVO, defer);
				break;
		}
		return defer.promise;
	},

	_vine: function(url, dest, name, vo, defer) {
		request(url).pipe(fs.createWriteStream(dest + name + ".mp4")).on('finish', function() {
			vo['absolutePath'] = dest + name + ".mp4";
			//static video folder
			vo['path'] = name + ".mp4";
			defer.resolve(vo);
		});
	},


	_youtube: function(url, dest, name, vo, defer) {
		youtubeDL(url, {
			quality: config.YOUTUBE_QUALITY
		})
		.on('error', function(e){
			console.log("Error!!!");
			console.log(e);
		})
		.pipe(fs.createWriteStream(dest + name + ".mp4")).on('finish', function() {
			vo['absolutePath'] = dest + name + ".mp4";
			//static video folder
			vo['path'] = name + ".mp4";
			defer.resolve(vo);
		});
	}
};

module.exports = videoDownloader;