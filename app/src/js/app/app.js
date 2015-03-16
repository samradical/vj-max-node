// vendor dependencies
var Marionette = require('marionette');

// constructor
var App = new Marionette.Application();

App.addInitializer(function() {

	// app dependencies in correct order

	// commons
	require('./common/utils');
	require('./common/storage');
	require('./common/config');
	require('./common/constants');

	// entities
	require('./entities/max_module/max_module_fetcher');
	require('./entities/max_module/max_module_entity');
	require('./entities/playlist/playlist_entity');
	// regions
	require('./regions/app_regions');

	//view controllers
	require('./controllers/max_modules/max_modules_controller');
	require('./controllers/playlist/playlist_controller');
	//views
	require('./views/max_modules/max_modules_view');
	require('./views/playlist/playlist_view');

	require('./views/app_view');
	if(IS_APP){
		require('./controllers/server_controller');
	}else{
		require('./controllers/socket_controller');
	}
	require('./controllers/app_controller');

	// routers
	require('./routers/app_router');
	// after little delay preload core data
	setTimeout(function(){
		App.trigger(App.Constants.EVENTS.PRELOADED);
	}, 500);

});

// export
module.exports = App;
