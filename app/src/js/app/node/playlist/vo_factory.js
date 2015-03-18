var _ = require('lodash');
var blockVO = require('./block_vo');
var videoVO = require('./video_vo');



function VOFACTORY() {
	this.blockCount = 0;
	this.videoCount = 0;
}

VOFACTORY.prototype.block = function() {
	var block = _.cloneDeep(blockVO);
	block['uid'] = this.blockCount;
	block['VOs'] = [];
	this.blockCount++;
	return block;
};

VOFACTORY.prototype.youtubeBlock = function() {
	var block = this.block();
	block['type'] = 'youtube';
	block['VOs'] = [];
	return block;
};

VOFACTORY.prototype.vineBlock = function() {
	var block = this.block();
	block['type'] = 'vine';
	block['VOs'] = [];
	return block;
};

VOFACTORY.prototype.video = function() {
	var vo = _.cloneDeep(videoVO);
	vo['uid'] = this.videoCount;
	this.videoCount++;
	return vo;
};

VOFACTORY.prototype.youtubeVideo = function() {
	var video = this.video();
	video['type'] = 'youtube';
	return video;
};

VOFACTORY.prototype.vineVideo = function() {
	var video = this.video();
	video['type'] = 'vine';
	return video;
};

var instance = new VOFACTORY();

module.exports = instance;
/*var VO_FACTORY = {
	blockCount: 0,
	videoCount: 0,
	block: function() {
		var block = _.cloneDeep(blockVO);
		block['uid'] = this.blockCount;
		block['VOs'] = [];
		this.blockCount++;
		return block;
	},
	youtubeBlock: function() {
		var block = this.block();
		block['type'] = 'youtube';
		block['VOs'] = [];
		return block;
	},
	vineBlock: function() {
		var block = this.block();
		block['type'] = 'vine';
		block['VOs'] = [];
		return block;
	},


	video: function() {
		var vo = _.cloneDeep(videoVO);
		vo['uid'] = this.videoCount;
		this.videoCount++;
		return _.cloneDeep(videoVO);
	},
	youtubeVideo: function() {
		var video = this.video();
		video['type'] = 'youtube';
		return video;
	},
	vineVideo: function() {
		var video = this.video();
		video['type'] = 'vine';
		return video;
	}
};*/