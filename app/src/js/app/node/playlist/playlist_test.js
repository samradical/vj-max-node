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
	var manager = require('./playlist_manager');
	var max = require('./../max/max');

	function _init(){
		manager.getVineMe().then(function(r){
			console.log(r);
		}).done();
	}

	_init();

	return {
	}

})();

module.exports = Playlist;