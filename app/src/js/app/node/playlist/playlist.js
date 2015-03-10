var Q = require('q');
var _ = require('lodash');
var SPAWN = require('child_process').spawn;

var MAX_VIDEO_PATH = "videos/vines/";

var Playlist = (function() {
	var activeVOs = [];
	var playlist = undefined;
	var playlistReady = false;

	var requirements = undefined;
	var interval;

	var config = require('./playlist_config');
	var downloader = require('./video_downloader');
	var builder = require('./playlist_builder');
	var max = require('./../max/max');

	function _getDefaultPlaylist() {
		builder.build().then(function(p) {
			playlist = builder.playlist;
			//initial DL
			for (var i = 0; i < config.downloadBuffer; i++) {
				_downloadVideo(playlist[i]).then(function(vo) {
					console.log("downloaded: ", vo['name']);
					var ready = true;
					for (var j = 0; j < config.downloadBuffer; j++) {
						if (!playlist[j]['duration']) {
							ready = false
						}
					}
					if (ready) {
						console.log("READY TO GO");
						playlistReady = true;
						if (requirements) {
							_activatePlayListItems();
							_start();
						}
					}
				});
			}
		});
	}

	function _start() {
		if (interval) {
			return;
		}
		interval = setInterval(function() {
			_update();
		}.bind(this), config.UPDATE_INTERVAL);
	}

	function _update() {
		_.each(activeVOs, function(vo) {
			if (vo['active']) {
				vo['timeRemaining'] -= (config.UPDATE_INTERVAL * 0.001);
				if (vo['timeRemaining'] < 0) {
					_onVideoComplete(vo);
				}
			}
		}, this);
	}

	function _onVideoComplete(vo) {
		//var DEBUG = vo['index'] === 0 ? '+++++++++++++  ' : '------------  ';
		var indexOf = playlist.indexOf(vo);
		if(indexOf === -1){
			return;
		}
		vo['active'] = false;
		_deleteVideoFile(vo);
		var newVO = _grabNextVideo();
		playlist[indexOf] = newVO;
		//new video bottom playlist
		builder.pushNextVideoToPlaylist();
		//download next videos
		_checkBuffer();
		//send to max
		_activateItem(indexOf);
	}

	function _grabNextVideo(){
		var vo = playlist.splice(requirements.length, 1)[0];
		return vo;
	}

	function _deleteVideoFile(vo) {
		if(vo['type'] === 'user'){
			return;
		}
		SPAWN('rm', ['-f', vo['absolutePath']]);
	}

	function _checkBuffer() {
		for (var i = 0; i < config.downloadBuffer; i++) {
			if (!playlist[i]['path']) {
				_downloadVideo(playlist[i]);
			}
		}
	}

	function _downloadVideo(vo) {
		var defer = Q.defer();
		downloader.download(vo).then(function(v) {
			builder.setDuraion(v).then(function(voWithDur) {
				defer.resolve(voWithDur);
			});
		});
		return defer.promise;
	}

	function _activatePlayListItems() {
		if (!requirements) {
			return;
		}
		//top of playlist active
		console.log("----- PATCH REQUIRES ----");
		console.log(requirements);
		console.log("---------");
		for (var i = 0; i < requirements.length; i++) {
			_activateItem(i);
		}
	}

	function _activateItem(index) {
			var vo = playlist[index];
			activeVOs[index] = vo;
			activeVOs[index]['index'] = index;
			console.log("Index:", index, "Name: ", vo['name']);
			switch (index) {
				case 0:
					max.sender.readFirst(vo['absolutePath']);
					break;
				case 1:
					max.sender.readSecond(vo['absolutePath']);
					break;
				case 2:
					break;
				case 3:
					break;
			}
			vo['active'] = true;
		}
		//----------------
		//PUBLIC
		//----------------

	function setRequirements(rq) {
		/*
		Only video requirments right now
		*/
		requirements = rq;
	}

	function addUserVideo(absolutePath, name) {
		builder.addUserVideo(absolutePath, name, requirements);
	}

	_getDefaultPlaylist();

	return {
		setRequirements: setRequirements,
		addUserVideo: addUserVideo
	}

})();

module.exports = Playlist;