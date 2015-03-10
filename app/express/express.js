var express = require('express');
var io = require('socket.io');
var cors = require('cors'); // "Request" library
var ECT = require('ect');

var server;
var ectRenderer = ECT({
	watch: true,
	root: __dirname + '/views',
	ext: '.ect'
});

function ExpressServer(nodeServer) {
	var app = express();
	var users = {};


	app.use(cors({
		allowedOrigins: [
			'localhost',
			'app://',
			'app'
		]
	}));

	app.set('view engine', 'ect');
	app.engine('ect', ectRenderer.render);

	server = app.listen(3000);
	io = io.listen(server);

	app.get('/', function(req, res) {
		
	});

	app.get('/admin', function(req, res) {
		res.render('bpm');
	});

	/*-------------------*/
	//SEND FILES
	/*-------------------*/

	app.get('/bpm.js', function(req, res, next) {
		res.sendFile(__dirname + '/js/bpm.js');
	});

	app.get('/socket.io.js', function(req, res, next) {
		res.sendFile(__dirname + '/js/socket.io.js');
	});

	app.get('/bpm.css', function(req, res, next) {
		res.sendFile(__dirname + '/css/bpm.css');
	});

	/*---------------*/
	//SOCKET
	/*---------------*/
	io.on('connection', userConnected);

	/*WHEN THE USER FIRST CONNECTS*/
	function userConnected(socket) {
		users[socket.id] = socket;

		users[socket.id].on('socket:bpm', onSocketBpm);		

		console.log(socket.id, "connected!");

		socket.emit('handshake', {
			id: socket.id
		});

		users[socket.id].on('disconnect', function() {
			delete users[socket.id];
			console.log(socket.id, "disconnected!");
		});
	}

	function onSocketBpm(data){
		console.log("Changed bpm:", data);
		//in milliseconds
		nodeServer.max.bpm(data);
	}

	console.log('Listening on port 3000');
}

module.exports = ExpressServer;