//TODO кэширование, чтобы пересобирались не все файлы, а только измененные
var gulp = require('gulp');
var rename = require("gulp-rename");
//TODO sass
//var minifyCSS = require('gulp-csso');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('css', function(){
	return gulp.src(['./www/local/templates/*/css/**/*.scss',
	                 './www/local/templates/*/components/**/*.scss',
	], {base: '.'})
		//.pipe(less())
		//.pipe(minifyCSS())
		.pipe(rename({
			suffix: ".min",
			extname: ".css"
		}))
		.pipe(gulp.dest('./'))
});

gulp.task('js', function(){
	return gulp.src(['./www/local/templates/*/js/**/*[^.min].js', //TODO not min
		'./www/local/templates/*/components/**/*[^.min].js',
	], {base: '.'})
		.pipe(sourcemaps.init()) //TODO работает ли вообще?
		.pipe(rename({
			suffix: ".min"
		}))
		//.pipe(concat('app.min.js'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('./'))
});

gulp.task('default', ['css', 'js']);