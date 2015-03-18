var _ = require('lodash');
var voFactory = require('./vo_factory');
var config = require('./playlist_config');

var PLAYLIST_UTILS = {
	parseOptions: function(options, type) {
		if (!options) {
			if (!type) {
				return config['SEARCH_OPTIONS']['youtube'];
			}
			return config['SEARCH_OPTIONS'][type];
		}
		var o = config['SEARCH_OPTIONS'][type];
		_.forIn(o, function(val, key) {
			if (options[key] === undefined) {
				options[key] = val;
			}
		});
		return options;
	},

	/*
	data = array of youtube search results... data[i]['snippet']...
	options = same as search options
	*/
	createYoutubeBlock: function(term, data, options) {
		var block = voFactory.youtubeBlock();

	},

	/*
	array of vinevideos
	returns array
	*/
	createVineVOs: function(results, options) {
		var VOs = [];
		var i = 0;
		var choiceIndexs = [];
		for (i; i < options['maxResults']; i++) {
			var choiceIndex = i;
			if(i === results.length){
				break;
			}
			if (options['random']) {
				var choiceIndex = Math.floor(Math.random() * results.length);
				while (choiceIndexs.indexOf(choiceIndex) !== -1) {
					choiceIndex = Math.floor(Math.random() * results.length);
				}
				vineIndex = Math.floor(Math.random() * results.length);
			}
			choiceIndexs.push(choiceIndex);
		}
		i = 0;
		for (i; i < choiceIndexs.length; i++) {
			VOs.push(this.createVineVO(results[choiceIndexs[i]], i));
		}
		return VOs;
	},

	createVineVO: function(video, index) {
		var name = video['username'].replace(/\s/g, "_") + "_" + index;
		name = name.replace(/\//g, '_');
		var vo = voFactory.vineVideo();
		vo['name'] = name;
		vo['url'] = video['videoUrl'];
		return vo;
	}
};

module.exports = PLAYLIST_UTILS;