//var iSocket = ;
var express = require('express');
var fs = require('fs');
var cors = require('cors'); // "Request" library
var ECT = require('ect');
var busboi = require('connect-busboy');

var DESTINATION = '/Users/samelie/Dropbox/Max/_rad/videos/vines/'

var ectRenderer = ECT({
	watch: true,
	root: __dirname + '/views',
	ext: '.ect'
});

var EXPRESS = (function() {
	var NodeServer = undefined;

	var server;
	var app = express();
	var io;

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
	//start socket
	//io = iSocket(server);
	io = require('./socket/socket')(server);

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
					absolutePath: DESTINATION + filename,
					name: filename
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

	console.log('Listening on port 3000');

	function setNodeServer(ns) {
		NodeServer = ns;
		io.setNodeServer(NodeServer);
	}

	function emitAdmin(message, data) {
		io.emitAdmin(message, data);
	}

	return {
		setNodeServer: setNodeServer,
		emitAdmin: emitAdmin
	}

})();

module.exports = EXPRESS;
/*
function ExpressServer(NodeServer) {

}

ExpressServer.prototype.playlist = undefined;

module.exports = ExpressServer;*/