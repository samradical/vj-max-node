this.JST = {"app": function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="App">\n<div class="AppMaxModulesRegion" id="max-module-region"></div>\n<div class="AppPlaylistRegion" id="playlist-region"></div>\n</div>';

}
return __p
},
"controls_loop": function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="Controls ControlsLoop">\n\t<div>LOOP</div>\n\t<span class="ControlsButton ControlsIcon icon-up"></span>\n\t<span class="ControlsButton ControlsIcon icon-down"></span>\n</div>';

}
return __p
},
"max_modules": function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="MaxModules"></div>';

}
return __p
},
"max_patch": function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="MaxPatch">\n\t<div class="MaxPatch-name">\n\t\t<span>' +
((__t = (name)) == null ? '' : __t) +
'</span>\n\t</div>\n</div>';

}
return __p
},
"playlist": function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="MaxModules"></div>';

}
return __p
},
"playlist_item": function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="PlaylistItem">\n\t<img src="' +
((__t = (thumbSrc)) == null ? '' : __t) +
'">\n\t<div class="PlaylistItem-progress"></div>\n\t<div class="PlaylistItem-info">\n\t\t<div>' +
((__t = (name)) == null ? '' : __t) +
'</div>\n\t\t<div>type:' +
((__t = (type)) == null ? '' : __t) +
'</div>\n\t\t<div>loops:' +
((__t = (loops)) == null ? '' : __t) +
'</div>\n\t</div>\n\t<div id="controls-region"></div>\n</div>';

}
return __p
},
"playlist_item_controls": function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="PlaylistItemControls">\n\t<div id="loop-region"></div>\n</div>';

}
return __p
}};