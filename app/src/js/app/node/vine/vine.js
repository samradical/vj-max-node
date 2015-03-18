var Q = require('q');
var request = require('request');
var _ = require('lodash');

var HEADER = {
	'user-agent': 'com.vine.iphone/1.0.3 (unknown, iPhone OS 8.1.0, iPhone, Scale/2.000000)',
	'accept-language': 'en, sv, fr, de, ja, nl, it, es, pt, pt-PT, da, fi, nb, ko, zh-Hans, zh-Hant, ru, pl, tr, uk, ar, hr, cs, el, he, ro, sk, th, id, ms, en-GB, ca, hu, vi, en-us;q=0.8'
};

var SEARCH_LOCATIONS = ['tags', 'users', 'venues', 'posts'];

var VINE = {
	me: undefined,
	login: function(login) {
		login = login || {
			username: 'swagrad@gmail.com',
			password: 'kingdeth'
		};
		var self = this;
		var defer = Q.defer();
		var authOptions = {
			url: 'https://vine.co/api/users/authenticate',
			headers: HEADER,
			form: login
		};
		request.post(authOptions, function(error, response, body) {
			self.me = JSON.parse(body)['data'];
			// real id....
			var id = self.me['key'].split('-')[0];
			self.me['userId'] = id;
			defer.resolve(self.me);
		});
		return defer.promise;
	},

	getPopular: function() {
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

	getTag: function(tag, pageId) {
		var defer = Q.defer();
		var authOptions = {
			url: 'https://api.vineapp.com/timelines/tags/' + tag + '?size=100&page=' + pageId,
			headers: HEADER
		};

		request.get(authOptions, function(error, response, body) {
			defer.resolve(JSON.parse(body));
		});

		return defer.promise;
	},

	getTagAll: function(tag) {
		var defer = Q.defer();
		var resultItems = [];

		function _doquery(pageId) {
			var authOptions = {
				url: 'https://api.vineapp.com/timelines/tags/' + tag + '?size=100&page=' + pageId,
				headers: HEADER
			};
			request.get(authOptions, function(error, response, body) {
				var result = JSON.parse(body);
				if (result['data']['records'].length === 0) {
					defer.reject(new Error("No Vines with tag: " + tag));
				}
				resultItems.push(result['data']['records']);
				if (result['data']['nextPage']) {
					_doquery(result['data']['nextPage']);
				} else {
					defer.resolve(_.flatten(resultItems, true));
				}
			});
		}
		_doquery(1);
		return defer.promise;
	},

	getUserTimeline: function(login) {
		var self = this;
		return this.login(login).then(function(me){
			return self._getMe(me['userId']);
		});
	},

	_getMe: function(userId) {
		var defer = Q.defer();
		var resultItems = [];

		function _doquery(pageId) {
			var authOptions = {
				url: 'https://vine.co/api/timelines/users/' + userId + '?size=100&page=' + pageId,
				headers: HEADER
			};
			request.get(authOptions, function(error, response, body) {
				var result = JSON.parse(body);
				if (result['data']['records'].length === 0) {
					defer.reject(new Error("No Vines with tag: " + tag));
				}
				resultItems.push(result['data']['records']);
				if (result['data']['nextPage']) {
					_doquery(result['data']['nextPage']);
				} else {
					defer.resolve(_.flatten(resultItems, true));
				}
			});
		}
		_doquery(1);
		return defer.promise;
	},

	/*broken*/
	search: function(term) {
		var functions = [];
		_.each(SEARCH_LOCATIONS, function(type) {
			functions.push("this._searchType(" + '\'' + type + '\'' + "," + '\'' + term + '\'' + ")");
		}, this);
		var func = "[" + functions.join() + "]";
		var promises = Q.all(eval(func));
		return Q.allSettled(promises).then(function(results) {
			var data = [];
			_.each(results, function(result) {
				data.push(result['value']);
			});
			return _.flatten(data, true);
		});
	},

	_searchType: function(type, term) {
		var defer = Q.defer();
		var resultItems = [];

		function _doquery(pageId) {
			var authOptions = {
				url: 'https://api.vineapp.com/' + type + '/search/' + term + '?size=100&page=' + pageId,
				headers: HEADER
			};
			console.log(authOptions.url);
			request.get(authOptions, function(error, response, body) {
				var result = JSON.parse(body);
				if (result['data']['records'].length === 0) {
					deferred.reject(new Error("No Vines with"));
				}
				resultItems.push(result['data']['records']);
				if (result['data']['nextPage']) {
					_doquery(result['data']['nextPage']);
				} else {
					defer.resolve(_.flatten(resultItems, true));
				}
			});
		}
		_doquery(1);
		return defer.promise;
	}
};

module.exports = VINE;