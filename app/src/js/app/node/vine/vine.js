var Q = require('q');
var request = require('request');

var HEADER = {
	'user-agent': 'com.vine.iphone/1.0.3 (unknown, iPhone OS 8.1.0, iPhone, Scale/2.000000)',
	'accept-language': 'en, sv, fr, de, ja, nl, it, es, pt, pt-PT, da, fi, nb, ko, zh-Hans, zh-Hant, ru, pl, tr, uk, ar, hr, cs, el, he, ro, sk, th, id, ms, en-GB, ca, hu, vi, en-us;q=0.8'
};

var VINE = {
	login: function() {
		var defer = Q.defer();
		var authOptions = {
			url: 'https://api.vineapp.com/users/authenticate',
			headers: HEADER,
			form: {
				username: 'swagrad@gmail.com',
				password: 'kingdeth'
			}
		};

		request.post(authOptions, function(error, response, body) {
			defer.resolve(JSON.parse(body))
		});

		return defer.promise;
	},

	getPopular:function(){
		var defer = Q.defer();
		var authOptions = {
			url: 'https://api.vineapp.com/timelines/popular?size=100',
			headers: HEADER
		};

		request.get(authOptions, function(error, response, body) {
			defer.resolve(JSON.parse(body));
		});

		return defer.promise;
	},

	getTag:function(tag, pageId){
		var defer = Q.defer();
		var authOptions = {
			url: 'https://api.vineapp.com/timelines/tags/'+tag+'?size=100&page='+pageId,
			headers: HEADER
		};

		request.get(authOptions, function(error, response, body) {
			defer.resolve(JSON.parse(body));
		});

		return defer.promise;
		
	}
};


module.exports = VINE;