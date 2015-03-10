var Q = require('q');
var hosturl = "0.0.0.0";
var wsport = 3100;
var oscport = 8000;

var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({
	host: hosturl,
	port: wsport
});
var oscsender = require('omgosc').UdpSender;
var sender = new oscsender(hosturl, oscport);

var MAX_SENDER = {
	bpm:function(data){
		sender.send('admin/bpm', 'f', [data['bpm']]);
	}
};

/*function Max(nodeServer) {
	this.nodeServer = nodeServer;


	function bpm(data){
		console.log(data);
	}
}

Max.prototype.send = function(message, value, type) {
	type = type || 's';
	console.log("Sending to max: ", message, value);
	sender.send(message, type, [value]);
};*/


module.exports = MAX_SENDER;