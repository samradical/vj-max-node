//access to the nodeweb kit
var nwGui;
if (window.nwDispatcher) {
	nwGui = window.nwDispatcher.requireNwGui();
	//show dev
	var win = nwGui.Window.get();
	win.showDevTools();
	var nativeMenuBar = new nwGui.Menu({
		type: "menubar"
	});
	try {
		nativeMenuBar.createMacBuiltin("My App");
		win.menu = nativeMenuBar;
	} catch (ex) {
		console.log(ex.message);
	}
}

// app dependencies
var App = require('./app/app');

// kick off
App.start();