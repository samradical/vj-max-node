var Q = require('q');
var request = require('request');
var config = require('./../playlist/playlist_config');

var YOUTUBE = {
	getTrending:function(q){
		var defer = Q.defer();
		var params = {
			channelId:config.YOUTUBE_CHANNEL_ID,
			type:'video,channel,playlist',
			query:q || config.YOUTUBE_CHANNEL_KEYWORDS
		};

		request.get({
				url: config.JITSU_URL + 'youtube/search/',
				qs: params
			}, function(error, response, body) {
			defer.resolve(JSON.parse(body));
		});

		return defer.promise;
	},

	/*returns array of items*/
	getPlaylistItems:function(playlistId) {
		var defer = Q.defer();
		var count = 0;
		var resultItems = [];

		function _doquery(nextPageToken) {
			var params = {
				playlistId: playlistId,
				pageToken: nextPageToken
			};

			request({
				url: config.JITSU_URL + 'youtube/playlist/',
				qs: params
			}, function(err, response, body) {
				if (err) {
					console.log(err);
				}
				var parsed = JSON.parse(body);
				resultItems = resultItems.concat(parsed['items']);
				if (parsed['nextPageToken']) {
					_doquery(parsed['nextPageToken']);
				} else {
					defer.resolve(resultItems);
				}
			});
		}
		_doquery("");
		return defer.promise;
	}
};


module.exports = YOUTUBE;