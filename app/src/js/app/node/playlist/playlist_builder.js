var Q = require('q');
var _ = require('lodash');
var _ = require('lodash');
var config = require('./playlist_config');
var videoVO = require('./video_vo');
var vineService = require('./../vine/vine');
var youtubeService = require('./../youtube/youtube');
var ffmpeg = require('./../ffmpeg/ffmpeg');

var TYPE_VINE = 'vine';
var TYPE_YOUTUBE = 'youtube';
var TYPE_USER = 'user';
var YOUTUBE_WATCH_URL = "http://www.youtube.com/watch?v=";

var PLAYLIST_BUILDER = {
	videoVOIndex: 0,
	videoVOs: [], //both vines and youtubes
	vineVideoVOs: [], //before they get pushed into the playlist
	youtubeVideoVOs: [], //before they get pushed into the playlist
	userVideoVOs: [], //before they get pushed into the playlist
	playlist: [],
	build: function() {
		vineVideoVOs = [];
		playlist = [];
		var defer = Q.defer();
		var self = this;
		if (config.USE_YOUTUBE) {
			this._getTrendingYoutube();
		}
		this._getVinesByTags(config.defaultVineTag).then(function() {
			vineService.getPopular().then(function(popularVines) {
				self._parseVines(popularVines);
				self._buildPlaylist();
				defer.resolve(self.playlist);
			});
		});
		return defer.promise;
	},

	//----------------------
	//VINES
	//----------------------

	/*PARSES VINE TAG RESULT PAGES*/
	_getVinesByTags: function(tags) {
		var defer = Q.defer();
		var pageId = 1;
		var self = this;
		this._requestTaggedVines(tags, pageId).then(function(results) {
			//pages of results
			for (var i = 0; i < results.length; i++) {
				_.each(results[i], function(video, index) {
					var vo = self._createVineVO(video, index);
					self.vineVideoVOs.push(vo);
					self.videoVOs.push(vo);
				});
			}
			defer.resolve();
		});
		return defer.promise;
	},

	/*LOOPS OVER PAGES OF VINES*/
	_requestTaggedVines: function(tag, pageId, items, defer) {
		var self = this;
		items = items || [];
		var defer = defer || Q.defer();
		vineService.getTag(tag, pageId).then(function(tagResponse) {
			items.push(tagResponse['data']['records']);
			if (tagResponse['data']['nextPage']) {
				self._requestTaggedVines(tag, tagResponse['data']['nextPage'], items, defer);
			} else {
				defer.resolve(items);
			}
		});
		return defer.promise;
	},

	/*PARSES POPULAR VINES*/
	_parseVines: function(vineData) {
		var videos = vineData['data']['records'];
		_.each(videos, function(video, index) {
			var vo = this._createVineVO(video, index);
			this.vineVideoVOs.push(vo);
			this.videoVOs.push(vo);
		}, this);
	},

	_createVineVO: function(vineVideo, index) {
		var name = vineVideo['username'].replace(/\s/g, "_") + "_" + index;
		name = name.replace(/\//g, '_');
		var vo = this._createVO();
		vo['type'] = TYPE_VINE;
		vo['name'] = name;
		vo['url'] = vineVideo['videoUrl'];
		return vo;
	},


	//------------------
	//YOUTUBE
	//------------------

	//get a list of playlist IDS
	_getTrendingYoutube: function() {
		var defer = Q.defer();
		var self = this;
		youtubeService.getTrending().then(function(response) {
			var items = response['items'];
			for (var i = 0; i < config.YOUTUBE_MAX_TRENDING_PLAYLIST; i++) {
				var index = i;
				if (index !== 0) {
					//random trending after Trending Today (index 0)
					index = Math.floor(Math.random() * items.length);
				}
				youtubeService.getPlaylistItems(items[index]['id']['playlistId']).then(function(playlistItems) {
					_.each(playlistItems, function(item, index) {
						var snippet = item['snippet'];
						var vo = self._createVO();
						var name = snippet['title'].replace(/\s/g, "_") + "_" + index;
						name = name.replace(/\//g, '_');
						vo['type'] = TYPE_YOUTUBE;
						vo['name'] = name;
						vo['url'] = YOUTUBE_WATCH_URL + snippet['resourceId']['videoId'];
						self.youtubeVideoVOs.push(vo);
						self.videoVOs.push(vo);
					});
				});
			}
		});
	},

	_createVO: function() {
		return _.cloneDeep(videoVO);
	},

	_buildPlaylist: function() {
		//very original playlist
		//make shuffle the VOs
		for (var i = 0; i < config.length; i++) {
			this.videoVOIndex = i;
			this.playlist.push(this.videoVOs[i]);
		}
	},

	addUserVideo: function(absolutePath, name, requirements) {
		var index = requirements.length;
		var self = this;
		var vo = this._createVO();
		vo['type'] = TYPE_USER;
		vo['name'] = name;
		vo['absolutePath'] = absolutePath;
		vo['userVideo'] = true;
		this.setDuraion(vo).then(function(voWithDur) {
			//bumps the uservideos next on the list
			self.playlist.splice(index + self.userVideoVOs.length, 0, voWithDur);
			self.userVideoVOs.push(voWithDur);
		});
	},

	pushNextVideoToPlaylist: function() {
		if (this.videoVOIndex < this.videoVOs.length) {
			this.videoVOIndex++;
			this.playlist.push(this.videoVOs[this.videoVOIndex]);
		}
	},

	setDuraion: function(vo) {
		var defer = Q.defer();
		ffmpeg.getDuration(vo['absolutePath']).then(function(duration) {
			vo['duration'] = vo['timeRemaining'] = duration;
			defer.resolve(vo);
		});
		return defer.promise;
	}
};


module.exports = PLAYLIST_BUILDER;