//TODO кэширование, чтобы пересобирались не все файлы, а только измененные
//TODO watch for files
//TODO add CSS task
var gulp = require('gulp');
var rename = require("gulp-rename");
var sass = require('gulp-sass');
var babel = require('gulp-babel');
var uglify = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');
var sourcemaps = require('gulp-sourcemaps'); //TODO промежуточный sourcemap на sass, а не на css после обработки sass()

var base = 'www';
var paths = {
	styles: {
		src: ['./www/local/templates/*/css/**/*.scss',
		      './www/local/templates/*/components/**/*.scss'
		],
		dest: './' + base + '/'
	},
	scripts: {
		src: ['./www/local/templates/*/js/**/*[^.min].js',
		      './www/local/templates/*/components/**/*[^.min].js'
		],
		dest: './' + base + '/'
	}
};

function sassStyles() {
	return gulp.src(paths.styles.src, {base: base})
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(cleanCSS()) //TODO можно задать настройки по необходимым браузерам
		.pipe(rename({
			suffix: ".min",
			extname: ".css"
		}))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(paths.styles.dest))
}

function scripts() {
	return gulp.src(paths.scripts.src, {base: base})
		.pipe(sourcemaps.init())
		.pipe(rename({
			suffix: ".min"
		}))
		.pipe(babel())
		.pipe(uglify())
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(paths.scripts.dest))
}

function watch() {
	gulp.watch(paths.scripts.src, scripts);
	gulp.watch(paths.styles.src, sassStyles);
}

exports.sassStyles = sassStyles;
exports.scripts = scripts;
exports.watch = watch;

//var build = gulp.series(clean, gulp.parallel(scss, js));
var build = gulp.parallel(sassStyles, scripts);

//gulp.task('default', ['scss', 'js']);
gulp.task('default', build);