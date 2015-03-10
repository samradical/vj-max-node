var hosturl = "0.0.0.0";
var nodePort = 3000;
var maxport = 8000;
var osc = require('osc');

var nodeServer = new osc.UDPPort({
	localAddress: hosturl,
	localPort: nodePort
});

nodeServer.open();

var patches = ["rad-chroma-layer-subtract", "rad-chroma-layer-merge-xfade"]
	/*ar WebSocketServer = require('ws').Server;
	var wss = new WebSocketServer({
		host: hosturl,
		port: wsport
	});
	var oscsender = require('omgosc').UdpSender;


	var dgram = require('dgram');
	var client = dgram.createSocket("udp4");

	var sender = new oscsender(hosturl, oscport);

	wss.on('connection', function(ws) {
		console.log("CONNECTED!");

	});*/

function start() {
	var self = this;
	var buffer = new Buffer(13);
	buffer.write('I am a buffer, feels', 'utf-8');

	var message = [
		['string', 's', 'yankeedoodle'],
		['float', 'f', 0.025],
		['integer', 'i', 22]
	];

	nodeServer.send({
		address: 'create',
		args: patches[0]
	}, hosturl, maxport);

	sendVideos();
}

function sendVideos() {
	setTimeout(function() {
		nodeServer.send({
			address: 'readFirst',
			args: 'sun.mp4'
		}, hosturl, maxport);

		nodeServer.send({
			address: 'readSecond',
			args: 'itch.mp4'
		}, hosturl, maxport);
	}, 1000);
}

start();