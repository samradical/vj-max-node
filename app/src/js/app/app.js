// vendor dependencies
var Marionette = require('marionette');

// constructor
var App = new Marionette.Application();

App.addInitializer(function() {

	// app dependencies in correct order

	// commons
	require('./common/utils');
	require('./common/config');
	require('./common/constants');

	// entities
	require('./entities/max_module_entity');
	// regions
	require('./regions/app_regions');

	require('./controllers/app_controller');
	require('./controllers/server_controller');

	// routers
	require('./routers/app_router');
	// after little delay preload core data
	App.trigger(App.Constants.EVENTS.PRELOADED);

});

// export
module.exports = App;
