var io = require('socket.io');

var SOCKET = function(expressServer) {
	var NodeServer = undefined;
	var adminId = undefined;
	var users = {};
	io = io.listen(expressServer);

	/*---------------*/
	//SOCKET
	/*---------------*/
	io.on('connection', userConnected);

	/*WHEN THE USER FIRST CONNECTS*/
	//--------
	//USER
	//--------
	function onSocketBpm(data) {
		console.log("Changed bpm:", data);
		//in milliseconds
		nodeServer.max.bpm(data);
	}


	//--------
	//ADMIN
	//--------
	function onAdminConnected(data) {
		adminId = data['id'];
		users[data.id]['admin'] = true;
		console.log("Admin Connected: ", data.id);
		//console.log(NodeServer);
		users[adminId].emit('admin:playlist:started', NodeServer.playlist.getPlaylist());
	}

	function userConnected(socket) {
		users[socket.id] = socket;

		//USER
		users[socket.id].on('socket:bpm', onSocketBpm);

		//ADMIN
		users[socket.id].on('admin:connected', onAdminConnected);

		users[socket.id].emit('handshake', {
			id: users[socket.id].id
		});
		users[socket.id].on('disconnect', function() {
			delete users[socket.id];
			console.log(socket.id, "disconnected!");
		});

		console.log(users[socket.id]['id'], "connected!");
	}

	function onPlaylistStarted() {
		if (!adminId) {
			return;
		}
		users[adminId].emit('playlist:started');
	}

	//-----------------
	//PUBLIC
	//-----------------

	function emitAdmin(message, data){
		if(!users[adminId]){
			return;
		}
		users[adminId].emit(message, data);
	}

	function setNodeServer(ns){
		NodeServer = ns;
	}

	return {
		setNodeServer:setNodeServer,
		emitAdmin: emitAdmin
	}

};

module.exports = SOCKET;