this.JST = {"directory": function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<!-- <div>Choose File to encode</div>\n<input id="fileDialog" type="file" /> -->\n<div>Save Directory</div>\n<input id="outputDirectory" type="file" nwdirectory />\n';

}
return __p
},
"log": function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div>' +
((__t = (logging)) == null ? '' : __t) +
'</div>\n';

}
return __p
},
"search": function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div>Search terms (comma seperated)</div>\n<input type="text" autofocus />\n';

}
return __p
}};