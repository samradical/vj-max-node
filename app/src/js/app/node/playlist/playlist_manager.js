var Q = require('q');
var _ = require('lodash');
var builder = require('./playlist_builder_test');
var config = require('./playlist_config');

var MAX_VIDEO_PATH = "videos/vines/";

var PLAYLIST_MANAGER = {
	playlist:[],
	blocks:[],
	getVineMe:function(login, options){
		var self = this;
		return builder.getVineMe(login, options).then(function(block){
			self._addBlock(block);
			self._prependToPlaylist(block);
			return [self.playlist, block, self.blocks];
		});
	},
	getVineTag:function(){

	},
	_addBlock:function(block){
		this.blocks.push(block);
	},
	_prependToPlaylist:function(block){
		_.each(block['VOs'], function(vo){
			this.playlist.unshift(vo);
		}, this);
	},
	getBlocks:function(){
		return this.blocks;
	}
};

module.exports = PLAYLIST_MANAGER;