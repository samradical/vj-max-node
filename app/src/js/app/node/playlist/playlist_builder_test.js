var Q = require('q');
var _ = require('lodash');
var fs = require('fs.extra');
var config = require('./playlist_config');
var voFactory = require('./vo_factory');
var utils = require('./playlist_utils');
var vineService = require('./../vine/vine');
var youtubeService = require('./../youtube/youtube');
var ffmpeg = require('./../ffmpeg/ffmpeg');

var TYPE_VINE = 'vine';
var TYPE_YOUTUBE = 'youtube';
var TYPE_USER = 'user';
var YOUTUBE_WATCH_URL = "http://www.youtube.com/watch?v=";

/*retuns these blocks*/
var PLAYLIST_BUILDER = {

	//------------------
	//YOUTUBE
	//------------------

	/*COMLLICATED BECAUSE RESULTS ARENT VIDEOS*/
	/*searchVine:function(term, options){
		options = utils.parseOptions(options, 'vine');
		var self = this;
		var block = voFactory.vineBlock();
		block['term'] = term;
		return vineService.search(term).then(function(results){
			//results
			var i = 0;
			var choiceIndexs = [];
			for (i; i < options['maxResults']; i++) {
				var choiceIndex = i;
				if(options['random']){
					var choiceIndex = Math.floor(Math.random() * results.length);
					while(choiceIndexs.indexOf(choiceIndex) !== -1){
						choiceIndex = Math.floor(Math.random() * results.length);
					}
					vineIndex = Math.floor(Math.random() * results.length);
				}
				choiceIndexs.push(choiceIndex);
			}
			i = 0;
			console.log(results.length);
			for (i; i < choiceIndexs.length; i++) {
				block['VOs'].push(utils.createVineVO(results[choiceIndexs[i]]), i);
			}
			return block;
		});
	}, */

	getVineMe:function(login, options){
		options = utils.parseOptions(options, 'vine');
		var self = this;
		var block = voFactory.vineBlock();
		block['term'] = 'profile';
		return vineService.getUserTimeline(login).then(function(results){
			block['VOs'] = utils.createVineVOs(results, options);
			return block;
		});
	},

	getVineTag:function(tags, options){
		options = utils.parseOptions(options, 'vine');
		var self = this;
		var block = voFactory.vineBlock();
		block['term'] = tags;
		tags = tags.replace(/\s/g, "");
		return vineService.getTagAll(tags).then(function(results){
			block['VOs'] = utils.createVineVOs(results, options);
			return block;
		});
	},

	getYoutubeVideos:function(querys, options){
		options = utils.parseOptions(options, 'youtube');
		var self = this;
	},

	/*RETUNS A BLOCK*/
	//MAYBE THINK ABOUT STATS?
	_getTrendingYoutube: function(options) {
		options = utils.parseOptions(options, 'youtube');
		var self = this;
		//try for even spread accross playlists
		var videosPerPlaylist = Math.ceil(options['maxResults'] / options['maxTrendingPlaylist']);
		var block = voFactory.youtubeBlock();
		block['custom'] = true;
		block['term'] = 'trending';

		return youtubeService.getTrending().then(function(response) {
			var i = 0;
			//playlists
			var items = response['items'];
			var functions = [];
			//how many playlists to select
			for (i; i < options['maxTrendingPlaylist']; i++) {
				var index = i;
				if (index !== 0) {
					//random trending after Trending Today (index 0)
					if (options['random']) {
						index = Math.floor(Math.random() * items.length);
					}
				}
				functions.push("youtubeService.getPlaylistItems(items[" + index + "]['id']['playlistId'])");
			}
			var func = '[' + functions.join() + ']';
			var promises = Q.all(eval(func));
			return Q.allSettled(promises).then(function(results) {
				_.each(results, function(result) {
					//loop through items
					for (var i = 0; i < result['value'].length; i++) {
						if (block['VOs'].length === options['maxResults']) {
							break;
						}
						//this is linear, could be random
						var snippet = result['value'][i]['snippet'];
						if (!snippet || i > videosPerPlaylist) {
							continue;
						}
						var vo = voFactory.youtubeVideo();
						var name = snippet['title'].replace(/\s/g, "_") + "_" + i;
						name = name.replace(/\//g, '_');
						vo['name'] = name;
						vo['url'] = YOUTUBE_WATCH_URL + snippet['resourceId']['videoId'];
						block['VOs'].push(vo);
					}
				});
				return block;
			});
		});
	},

	init: function() {
		/*this._getTrendingYoutube().then(function(results) {
			console.log(results);
		}).done();*/

		/*this.getVineTag('epicfail').then(function(r){
			console.log(r);
		}).fail(function(err){
			console.log(err);
		});*/

		this.getVineMe({username:"eggbeer@gmail.com", password:"kingdeth"}).then(function(r){
			//console.log(r);
		});
	}
};

//PLAYLIST_BUILDER.init();


module.exports = PLAYLIST_BUILDER;