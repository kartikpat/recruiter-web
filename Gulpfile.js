/**
 * Sample gulpfile corresponding to the current repo structure including sass to css compilation, css concatenation and minification, js concatenation and minification.
 */

var gulp = require("gulp");
var log = require('fancy-log');
var sass = require("gulp-sass");
var del = require("del");	
var notify = require("gulp-notify");
var moment = require("moment");
var cached = require('gulp-cached');
var remember = require('gulp-remember');
var uglifycss = require("gulp-uglifycss");
var concat = require('gulp-concat');
var staticMapper = require("./asset-mapper.json");
var uglify = require('gulp-uglify');
var gulpDebug = require('gulp-debug');
const config = require("./configuration.json");

const assetsVersion = config['assetsVersion'];

// Use mocha for test driven development. But make this your last resort.
// var mocha = require('./gulp-mocha')

function getAssetsArray(location){
	var assets = [];
	location.forEach(function(anAsset){
		assets.push(anAsset);
	});
	return assets;
}

gulp.task('clean', function(done){
	log('Cleaning build directory');
	return del([
			'static/build/css/**/*.css',
			'static/build/js/**/*.js',
		], done);
});

/*****************************************/
gulp.task('build-css', async function(done){
	var promiseArray = [];
	for(var key in staticMapper){
		promiseArray.push(buildSingleCSS(key));
	}
	try{
		await Promise.all(promiseArray);
		console.log('done')
		done();
	}catch(err){
		console.log(err);
	};
	
});


gulp.task('build-js', async function(done){
	log('building minified js')
	var promiseArray = [];
	for(var key in staticMapper){
		promiseArray.push(buildSingleJs(key));
		console.log(cached.caches);
	}
	try{
		await Promise.all(promiseArray);
		done();
	}catch(err){
		console.log(err);
	};
});


function buildSingleJs(staticMapperElement){
	console.log(staticMapperElement);
	console.log(getAssetsArray(staticMapper[staticMapperElement]["scripts"]["debug"]))
	return new Promise(function(resolve, reject){
		return gulp.src(getAssetsArray(staticMapper[staticMapperElement]["scripts"]["debug"]))
		.pipe(gulpDebug())
		.pipe(cached('scripts'))
		.on('error', notify.onError("Error: <%= error.message %>"))
		.pipe(remember('scripts'))
		.on('error', notify.onError("Error: <%= error.message %>"))
		.pipe(concat(staticMapper[staticMapperElement]["scripts"]["prod"][0]))
		.on('error', notify.onError("Error: <%= error.message %>"))
		.pipe(gulp.dest('testingBuild'))
		.on('end', function(){
			console.log('hey')
			resolve();
		})

	})
}

gulp.task('test-hi', async function(){
	// await buildSingleJs("job-details");
	// await buildSingleJs("reset-password");
	await Promise.all([buildSingleJs("job-details"),buildSingleJs("reset-password")])

	return
})

function buildSingleCSS(staticMapperElement){
	return new Promise(function(resolve, reject){
		gulp.src(getAssetsArray(staticMapper[staticMapperElement]["styles"]["debug"]))
		.pipe(concat(staticMapper[staticMapperElement]["styles"]["prod"][0]))
		.on('error', notify.onError("Error: <%= error.message %>"))
		.pipe(uglifycss())
		.on('error', notify.onError("Error: <%= error.message %>"))
		.pipe(gulp.dest('testingBuild'))
	    .on('end', resolve)
	})
}


gulp.task('watch', function(){
	gulp.watch("static/css/**/*.scss", gulp.series('build-sass', 'build-css'))
	gulp.watch("static/js/**/*.js", gulp.series('build-js'))
})

/*****************************************/

gulp.task('build-sass',function(done){
	return gulp.src('static/scss/**/*.scss')
		.pipe(sass())
		.on('error', notify.onError("Error: <%= error.message %>"))
		.pipe(gulp.dest('static/css'))
});

//For running test through mocha
// gulp.task('run-test', function(){
// 	 gulp.src('test/**.js', {read: false})
//         .pipe(mocha({reporter: 'list'}));
//   //mocha({reporter: 'list'});
// });

// /*****************************************/

// gulp.task('watch-test', function(){
// 	gulp.watch('test/**.js', ['run-test']);
// })

/*****************************************/

// gulp.task('watch', ['clean','build-sass', 'build-css', 'build-js'], function(){
// 	gulp.watch('static/scss/**/*.scss', ['build-sass']);
// });


/*****************************************/
// gulp.task('watch', ['clean','build-sass', 'build-css'], function(){
// 	gulp.watch('static/scss/**/*.scss', ['build-sass']);
// });

gulp.task('build', gulp.series('clean','build-sass', gulp.parallel('build-css', 'build-js')));

gulp.task('default', gulp.series('watch'));
// gulp.task('default', ['watch']);
/*****************************************/