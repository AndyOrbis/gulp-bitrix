//TODO кэширование, чтобы пересобирались не все файлы, а только измененные
//TODO add CSS task

import gulp from 'gulp';
import rename from 'gulp-rename';
import sass from 'gulp-sass';
import babel from 'gulp-babel';
import uglify from 'gulp-uglify';
import cleanCSS from 'gulp-clean-css';
import sourcemaps from 'gulp-sourcemaps'; //TODO промежуточный sourcemap на sass, а не на css после обработки sass()

const base = 'www';
const paths = {
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

export function sassStyles() {
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

export function scripts() {
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

export function watch() {
	gulp.watch(paths.scripts.src, scripts);
	gulp.watch(paths.styles.src, sassStyles);
}

/*exports.sassStyles = sassStyles;
exports.scripts = scripts;
exports.watch = watch;*/

//var build = gulp.series(clean, gulp.parallel(scss, js));
const build = gulp.parallel(sassStyles, scripts);

//gulp.task('default', ['scss', 'js']);
gulp.task('build', build);
export default build;