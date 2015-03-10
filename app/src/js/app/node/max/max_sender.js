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

//readFirst
//readSecond

var MAX_SENDER = {
	create:function(name){
		sender.send('admin/create', 's', [name]);
	},
	readFirst:function(path){
		sender.send('admin/readFirst', 's', [path]);
	},
	readSecond:function(path){
		sender.send('admin/readSecond', 's', [path]);
	},
	readThird:function(path){
		sender.send('admin/readThird', 's', [path]);
	},
	readFourth:function(path){
		sender.send('admin/readFourth', 's', [path]);
	},
	bpm:function(data){
		sender.send('admin/bpm', 'f', [data['bpm']]);
	}
};

module.exports = MAX_SENDER;