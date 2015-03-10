var express = require('express');
var io = require('socket.io');
var fs = require('fs');
var cors = require('cors'); // "Request" library
var ECT = require('ect');
var busboi = require('connect-busboy');

var DESTINATION = '/Users/samelie/Dropbox/Max/_rad/videos/vines/'

var server;
var ectRenderer = ECT({
	watch: true,
	root: __dirname + '/views',
	ext: '.ect'
});

function ExpressServer(NodeServer) {
	var app = express();
	var users = {};


	app.use(cors({
		allowedOrigins: [
			'localhost',
			'app://',
			'app'
		]
	}));

	app.use(busboi());

	app.set('view engine', 'ect');
	app.engine('ect', ectRenderer.render);

	server = app.listen(3000);
	io = io.listen(server);

	app.get('/', function(req, res) {
		res.render('file-upload');
	});

	app.get('/admin', function(req, res) {
		res.render('bpm');
	});

	/*-------------------*/
	//POST
	/*-------------------*/

	app.post('/fileupload', function(req, res) {
		var fstream;
		req.pipe(req.busboy);
		req.busboy.on('file', function(fieldname, file, filename) {
			console.log("Uploading: " + filename);
			filename = filename.toLowerCase();
			//Path where image will be uploaded
			fstream = fs.createWriteStream(DESTINATION + filename);
			file.pipe(fstream);
			fstream.on('close', function() {
				console.log("Upload Finished of " + filename);
				NodeServer.playlist.addUserVideo(DESTINATION + filename, filename);
				res.send({
					absolutePath:DESTINATION + filename,
					name:filename
				});
			});
		});
	});

	/*-------------------*/
	//SEND FILES
	/*-------------------*/

	app.get('/bpm.js', function(req, res, next) {
		res.sendFile(__dirname + '/js/bpm.js');
	});

	app.get('/bpm.css', function(req, res, next) {
		res.sendFile(__dirname + '/css/bpm.css');
	});

	app.get('/file-upload.js', function(req, res, next) {
		res.sendFile(__dirname + '/js/file-upload.js');
	});

	app.get('/file-upload.css', function(req, res, next) {
		res.sendFile(__dirname + '/css/file-upload.css');
	});

	app.get('/socket.io.js', function(req, res, next) {
		res.sendFile(__dirname + '/js/socket.io.js');
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

	function onSocketBpm(data) {
		console.log("Changed bpm:", data);
		//in milliseconds
		nodeServer.max.bpm(data);
	}

	console.log('Listening on port 3000');
}

ExpressServer.prototype.playlist = undefined;

module.exports = ExpressServer;