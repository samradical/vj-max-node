// app
var App = require('../app');
require('q');

App.module('Controllers', function(Controllers, App, Backbone, Marionette, $, _) {
	Controllers.Socket = {
		init: function() {
			SOCKET.on('admin:playlist:started', function(playlist) {
				App.Entities.Playlist.setPlaylist(playlist);
			});

			SOCKET.on('admin:playlist:update', function(activeVOs) {
				App.Entities.Playlist.updateActiveVOs(activeVOs);
			});

			SOCKET.on('admin:playlist:updatevo', function(vo) {
				App.Entities.Playlist.updateVO(vo);
			});

			SOCKET.on('handshake', function(data) {
				SOCKET.emit('admin:connected', data);
				console.log("Socket connected: ", data);
			});
		},

		updateVO:function(vo){
			SOCKET.emit('admin:updatevo', vo);
		}
	};

	Controllers.Socket.init();
});

// export
module.exports = App.Controllers.Socket;