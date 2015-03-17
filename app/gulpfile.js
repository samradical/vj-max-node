var PORT = 8000;

/* jshint strict: false */
var gulp = require('gulp'),
	browserify = require('browserify'),
	source = require('vinyl-source-stream'),
	chalk = require('chalk'),
	connectHistoryApiFallback = require('connect-history-api-fallback'),
	shelljs = require('shelljs'),
	nwbuilder = require('node-webkit-builder'),
	plugins = require('gulp-load-plugins')();

/*var gulp = require('gulp'),
	plugins = require('gulp-load-plugins')(),
	jshint = require('gulp-jshint'),
	csslint = require('gulp-csslint');*/
// paths and file names
var src = './src',
	dist = './',
	maxModules = dist+ 'max-modules/',
	nodeModules = './node_modules',
	distAssets = dist + 'assets',
	jsSrc = src + '/js/',
	jsIndex = 'main.js',
	iconSrc = src + '/glyphs/svg/',
	iconDist = distAssets+'/icons/',
	jsDist = distAssets + '/js/',
	jsonDist = distAssets + '/json/',
	jsBundle = 'bundle.js',
	cssSrc = src + '/styl/',
	cssIndex = 'main.css',
	cssDist = distAssets + '/css/',
	cssBundle = 'styles.css',
	tplSrc = src + '/ejs/**/*.ejs',
	vendors = distAssets + '/vendor/';

//CONNECT
gulp.task('connect', function() {
	plugins.connect.server({
		livereload: true,
		port: PORT,
		root: dist,
		middleware: function(connect, opt) {
			return [connectHistoryApiFallback];
		}
	})
});

//HTML
gulp.task('html', function() {
	return gulp.src(dist + '/*.html')
		.pipe(plugins.connect.reload());
});

//CSS
gulp.task('css', function() {
	return gulp.src(cssSrc + '*.styl')
		.pipe(plugins.plumber())
		.pipe(plugins.stylus({
			'include css': true
		}))
		.pipe(plugins.rework(
			require('rework-suit'),
			require('rework-breakpoints'),
			require('rework-clearfix')
		))
		.pipe(plugins.autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
		.pipe(gulp.dest(cssDist))
		.pipe(plugins.rename({
			suffix: '.min'
		}))
		.pipe(plugins.minifyCss())
		.pipe(gulp.dest(cssDist))
		.pipe(plugins.connect.reload());
});


//TEMPLATE JS
gulp.task('templates', function() {
	gulp.src(tplSrc)
		.pipe(plugins.jstConcat('templates.js', {
			renameKeys: ['^.*ejs/(.*).ejs', '$1'] // Removes file path from key
		}))
		.pipe(gulp.dest(jsDist))
		.pipe(plugins.connect.reload());
});


//VENDOR JS
function buildVendorJS(debug) {
	stream = gulp.src([
			vendors + 'jquery/dist/jquery.js',
			vendors + 'lodash/lodash.js',
			vendors + 'backbone/backbone.js',
			vendors + 'marionette/backbone.marionette.js'
		])
		.pipe(plugins.concat('libraries.js'))
		.pipe(gulp.dest(jsDist))
		.pipe(plugins.if(!debug, plugins.rename({
			suffix: '.min'
		})))
		.pipe(plugins.if(!debug, plugins.streamify(plugins.stripDebug())))
		.pipe(plugins.if(!debug, plugins.uglify()))
		.pipe(plugins.if(!debug, gulp.dest(jsDist)));
};

gulp.task('vendor-scripts', function() {
	buildVendorJS(true);
});

gulp.task('vendor-scripts-release', function() {
	buildVendorJS(false);
});


//PROJECT JS
function buildProjectJS(debug) {
	var bundler = browserify(jsSrc + jsIndex);
	//bundler.plugin(remapify, [{
	//	src: jsSrc + 'common/**/*.js',
	//	expose: 'common',
	//	cwd: __dirname
	//}])
	var bundle = function() {
		var bundleStream = bundler.bundle({
			debug: debug,
			alias: [
					nodeModules + '/express/lib/express.js:./lib-cov/express'
				]
				/*,
				alias:[
					'common/constants.js:constants'
				]*/
				/*insertGlobals: true,
				shim: {
					templates: {
						path: distAssets + '/js/templates.js',
						exports: 'templates',
						depends: {
							underscore: '_'
						}
					}
				}*/
		});
		return bundleStream
			.on('error', logError)
			.pipe(source(jsSrc + jsIndex))
			.pipe(plugins.if(!debug, plugins.streamify(plugins.stripDebug())))
			.pipe(plugins.if(!debug, plugins.streamify(plugins.uglify())))
			.pipe(plugins.rename(jsBundle))
			.pipe(plugins.if(!debug, plugins.rename({
				suffix: '.min'
			})))
			.pipe(gulp.dest(jsDist))
			.pipe(plugins.connect.reload());
	};
	return bundle();
};

gulp.task('project-scripts', function() {
	buildProjectJS(true);
});

gulp.task('project-scripts-release', function() {
	buildProjectJS(false);
});


//LOG
function logError(msg) {
	console.log(chalk.bold.red('[ERROR]'), msg);
}


//JS HINT - ignore libraries and bundled
gulp.task('jshint', function() {
	return gulp.src([
			'./gulpfile.js',
			jsSrc + '/**/*.js',
			'!' + vendors + '**/*.js',
			'!' + jsSrc + '/lib/**/*.js',
			'!' + jsDist + jsBundle
		])
		.pipe(jshint({
			'node': true,
			'browser': true,
			'es5': false,
			'esnext': true,
			'bitwise': false,
			'camelcase': false,
			'curly': true,
			'eqeqeq': true,
			'immed': true,
			'latedef': true,
			'newcap': true,
			'noarg': true,
			'quotmark': 'single',
			'regexp': true,
			'undef': true,
			'unused': true,
			'strict': true,
			'trailing': true,

			'predef': [
				'Modernizr',
				'ga'
			]
		}))
		.pipe(jshint.reporter('jshint-stylish'));
});

// build css using minify and autoprefixer
/*gulp.task('css', function() {
	gulp.src(cssSrc + cssIndex)
		.on('error', logError)
		.pipe(minifyCSS({
			keepBreaks: true
		}))
		.pipe(rework(
			require('rework-suit')
		))
		.on('error', logError)
		.pipe(autoprefix('last 2 version', '> 1%'))
		.on('error', logError)
	//.pipe(rename({suffix: '.min'}))
	.pipe(rename(cssBundle))
		.pipe(gulp.dest(cssDist))
		.pipe(connect.reload());
});*/


//CSS LINT - ignore bundled
gulp.task('csslint', function() {
	gulp.src([
			cssSrc + '**/*.css',
			'!' + cssSrc + cssIndex,
			'!' + cssDist + cssBundle
		])
		.pipe(csslint({
			'adjoining-classes': false,
			'box-model': false,
			'box-sizing': false,
			'compatible-vendor-prefixes': false,
			'bulletproof-font-face': false,
			'empty-rules': false,
			'font-faces': false,
			'font-sizes': false,
			'important': false,
			'known-properties': false,
			'outline-none': false,
			'regex-selectors': false,
			'star-property-hack': false,
			'unique-headings': false,
			'universal-selector': false,
			'unqualified-attributes': false
		}))
		.pipe(csslint.reporter());
});

/*APP PACKAGING*/

gulp.task('copyMax', function() {
	return gulp.src(["../max-modules/**/*"])
		.pipe(gulp.dest(maxModules))
		.pipe(gulp.dest(jsSrc+'app/node/max-modules/'))
		.pipe(gulp.dest(jsonDist+'max-modules/'));
});

gulp.task('copyServer', function() {
	return gulp.src([
			jsSrc + 'app/node/**/*',
			'!' + jsSrc + 'app/node/node_modules/**/*',
			'!' + jsSrc + 'app/node/labs/**/*',
			'!' + jsSrc + 'app/node/package.json'
		])
		.pipe(gulp.dest(dist));
});

gulp.task('packageApp', function() {
	shelljs.exec('rm app.nw');
	return gulp.src(['index.html', 'assets/**/*', 'package.json', 'server.js',
			'express/**/*',
			'max/**/*',
			'views/**/*',
			'youtube/**/*',
			'vine/**/*',
			'ffmpeg/**/*',
			'helper/**/*',
			'playlist/**/*',
			'node_modules/lodash/**/*',
			'node_modules/node-dir/**/*',
			'node_modules/q/**/*',
			'node_modules/fs.extra/**/*',
			'node_modules/request/**/*',
			'node_modules/ytdl-core/**/*',
			'node_modules/fluent-ffmpeg/**/*',
			'node_modules/shelljs/**/*',
			'node_modules/express/**/*',
			'node_modules/connect-busboy/**/*',
			'node_modules/socket.io/**/*',
			'node_modules/omgosc/**/*',
			'node_modules/ws/**/*',
			'node_modules/cors/**/*',
			'node_modules/ect/**/*',
			'max-modules/**/*'
		], {
			base: "."
		})
		.pipe(plugins.zip('app.nw'))
		.pipe(gulp.dest('./'));
});


gulp.task('cleanup', function() {
	shelljs.exec('rm server.js');
	shelljs.exec('rm -rf express');
	shelljs.exec('rm -rf max');
	shelljs.exec('rm -rf views');
	shelljs.exec('rm -rf vine');
	shelljs.exec('rm -rf labs');
	shelljs.exec('rm -rf ffmpeg');
	shelljs.exec('rm -rf playlist');
	shelljs.exec('rm -rf youtube');
	shelljs.exec('rm -rf helper');
	shelljs.exec('rm -rf max-modules');
});

gulp.task('buildApp', function() {
	var options = {
		files: ['index.html', 'assets/**/*', 'package.json', 'server.js',
			'server/**/*',
			'node_modules/lodash/**/*',
			'node_modules/node-dir/**/*',
			'node_modules/q/**/*',
			'node_modules/request/**/*',
			'node_modules/ytdl-core/**/*',
			'node_modules/fluent-ffmpeg/**/*',
			'node_modules/shelljs/**/*',
			'ffmpeg'
		],
		platforms: ['osx'],
		macZip: true
	};
	var builder = new nwbuilder(options);
	builder.build().then(function() {
		console.log('all done!');
	}).catch(function(error) {
		console.error(error);
	});
});

//WATCH
gulp.task('watch', function() {
	gulp.watch(cssSrc + '**/*.{styl,css}', ['css']);
	gulp.watch(dist + '/*.html', ['html']);
	gulp.watch(jsSrc + '**/*.js', ['project-scripts']);
	gulp.watch(src + '/ejs/*.ejs', ['templates']);
});

//JS
gulp.task('vendor', ['vendor-scripts-release']);
gulp.task('vendor-dev', ['vendor-scripts']);

gulp.task('app', ['copyMax','copyServer', 'packageApp']);
gulp.task('build-app', ['copyServer', 'buildApp']);

gulp.task('build', ['project-scripts-release', 'templates', 'css']);
gulp.task('build-dev', ['project-scripts', 'templates', 'css', 'copyServer', 'copyMax']);

//DEFAULT
gulp.task('default', ['watch', 'build-dev', 'connect']);