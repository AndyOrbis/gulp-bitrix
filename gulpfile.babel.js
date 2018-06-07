import gulp from 'gulp';
import rename from 'gulp-rename';
import sass from 'gulp-sass';
import babel from 'gulp-babel';
import uglify from 'gulp-uglify';
import cleanCSS from 'gulp-clean-css';
import sourcemaps from 'gulp-sourcemaps'; //TODO промежуточный sourcemap на sass, а не на css после обработки sass()
import imagemin from 'gulp-imagemin';

const base = 'www';
const paths = {
	styles: {
		src: ['./www/local/templates/*/css/**/*[^.min].?(s)css',
		      './www/local/templates/*/components/**/*[^.min].?(s)css'
		],
		dest: './' + base + '/'
	},
	scripts: {
		src: ['./www/local/templates/*/js/**/*[^.min].js',
		      './www/local/templates/*/components/**/*[^.min].js'
		],
		dest: './' + base + '/'
	},
	images: {
		src: './www/local/templates/*/images/**/*[^.min].+(png|gif|jpg|jpeg|svg)', //TODO почему сжимает не все SVG?
		dest: './' + base + '/'
	},
};

export function styles() {
	return gulp.src(paths.styles.src, {since: gulp.lastRun(styles), base: base})
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

export function scripts() {
	return gulp.src(paths.scripts.src, {since: gulp.lastRun(scripts), base: base})
		.pipe(sourcemaps.init())
		.pipe(rename({
			suffix: ".min"
		}))
		.pipe(babel())
		.pipe(uglify())
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(paths.scripts.dest))
}

export function images() {
	return gulp.src(paths.images.src, {since: gulp.lastRun(images), base: base})
		.pipe(imagemin())
		.pipe(rename({
			suffix: ".min"
		}))
		.pipe(gulp.dest(paths.images.dest))
}

export function watch() {
	gulp.watch(paths.scripts.src, scripts);
	gulp.watch(paths.styles.src, styles);
	gulp.watch(paths.images.src, images);
}

/*exports.styles = styles;
exports.scripts = scripts;
exports.watch = watch;*/

//var build = gulp.series(clean, gulp.parallel(scss, js));
const build = gulp.parallel(styles, scripts, images);

//gulp.task('default', ['scss', 'js']);
gulp.task('build', build);
export default build;