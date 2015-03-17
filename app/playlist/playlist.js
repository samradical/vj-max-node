var Q = require('q');
var _ = require('lodash');
var SPAWN = require('child_process').spawn;
var fs = require('fs.extra');

var MAX_VIDEO_PATH = "videos/vines/";

var Playlist = (function() {
	//ref
	var NodeServer = undefined;
	//
	var activeVOs = [];
	var playlist = undefined; //array
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
			var count = 0;
			for (var i = 0; i < config.downloadBuffer; i++) {
				_downloadVideo(playlist[i]).then(function(vo) {
					count++;
					if (count === config.downloadBuffer) {
						console.log("READY TO GO");
						playlistReady = true;
						if (requirements) {
							if (config.WRITE_PLAYLIST_FILE) {
								_dumpPlaylistFile();
							}
							_activatePlayListItems();
							_start();
						}
					}
				}).done();
			}
		}).done();
	}

	function _start() {
		if (interval) {
			return;
		}
		interval = setInterval(function() {
			_update();
		}.bind(this), config.UPDATE_INTERVAL);
		//tell front end to start
		_socketSendPlaylist();
	}

	function _update() {
		_.each(activeVOs, function(vo) {
			//if (vo['active']) {
			vo['timeRemaining'] -= (config.UPDATE_INTERVAL * 0.001);
			if (vo['timeRemaining'] < 0) {
				if (vo['loops'] === -1) {
					vo['timeRemaining'] = vo['duration'];
					console.log("Looped ∞: ", vo['name']);
				} else {
					vo['loops'] --;
					if (vo['loops'] <= 0 && _canComplete()) {
						vo['loops'] = 0;
						_onVideoComplete(vo);
					} else {
						if (!_canComplete()) {
							vo['loops'] = 1;
						}
						vo['timeRemaining'] = vo['duration'];
						console.log("Looped: ", vo['name']);
					}
				}
			}
		}, this);
		_socketSendActiveVOs();
	}

	function _canComplete() {
		return playlist[requirements.length]['absolutePath'];
	}

	function _onVideoComplete(vo) {
		//var DEBUG = vo['index'] === 0 ? '+++++++++++++  ' : '------------  ';
		var indexOf = playlist.indexOf(vo);
		if (indexOf === -1) {
			return;
		}
		//vo['active'] = false;
		_deleteVideoFile(vo);
		var newVO = _grabNextVideo();
		playlist[indexOf] = newVO;
		//new video bottom playlist
		builder.pushNextVideoToPlaylist();
		//download next videos
		_checkBuffer();
		//send to max
		_activateItem(indexOf);
		//update front end
		_socketSendPlaylist();
	}

	function _grabNextVideo() {
		var vo = playlist.splice(requirements.length, 1)[0];
		return vo;
	}

	function _deleteVideoFile(vo) {
		//dont delete user videos
		if (vo['type'] === 'user') {
			return;
		}
		SPAWN('rm', ['-f', vo['absolutePath']]);
	}

	function _checkBuffer() {
		for (var i = 0; i < config.downloadBuffer; i++) {
			if (!playlist[i]['path']) {
				_downloadVideo(playlist[i]).then(function(vo) {
					_socketSendVO(vo);
				}).done();
			}
		}
	}

	function _downloadVideo(vo) {
		return downloader.download(vo).then(function(v) {
			return builder.videoPrep(v);
		});
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
		if (!vo['absolutePath']) {
			//not finished yet
			console.log("FAILED ON ", vo['name'], index);
			return;
		}
		activeVOs[index] = vo;
		activeVOs[index]['index'] = index;
		console.log("Index:", index, "Name: ", vo['absolutePath']);
		switch (index) {
			case 0:
				max.sender.readFirst(vo['absolutePath']);
				break;
			case 1:
				max.sender.readSecond(vo['absolutePath']);
				break;
			case 2:
				max.sender.readThird(vo['absolutePath']);
				break;
			case 3:
				max.sender.readFourth(vo['absolutePath']);
				break;
		}
		//vo['active'] = true;
	}


	//----------------
	//EXTERNAL RELATED
	//----------------


	function _dumpPlaylistFile() {
		var dest = config.PLAYLIST_FILE_DESTINATION + 'playlist.json';
		var s = JSON.stringify(playlist);
		fs.writeFile(dest, s, function(err) {
			if (err) throw err;
			console.log('Saved playlist json');
		});
	}

	function _socketSendPlaylist() {
		NodeServer.express.emitAdmin('admin:playlist:started', playlist);
	}

	function _socketSendActiveVOs() {
		NodeServer.express.emitAdmin('admin:playlist:update', activeVOs);
	}

	function _socketSendVO(vo) {
			NodeServer.express.emitAdmin('admin:playlist:updatevo', vo);
		}
		//----------------
		//PUBLIC
		//----------------

	function getPlaylist() {
		return playlist;
	}

	function setRequirements(rq) {
		/*
		Only video requirments right now
		*/
		requirements = rq;
		config.downloadBuffer = Math.min(config.downloadBuffer, requirements.length * 2);
	}

	function addUserVideo(absolutePath, name) {
		builder.addUserVideo(absolutePath, name, requirements);
	}

	function setNodeServer(ns) {
		NodeServer = ns;
	}

	/*From frontend*/

	function updateVO(vo) {
		_.each(playlist, function(item) {
			if (item['name'] === vo['name']) {
				_.forIn(item, function(value, key) {
					_.each(config.controls, function(controlProp) {
						//allowed to change
						if (key === controlProp) {
							item[key] = vo[key];
						}
					});
				});
				console.log(item);
			}
		});
	}

	_getDefaultPlaylist();

	return {
		getPlaylist: getPlaylist,
		setNodeServer: setNodeServer,
		setRequirements: setRequirements,
		addUserVideo: addUserVideo,
		updateVO: updateVO
	}

})();

module.exports = Playlist;