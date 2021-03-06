import gulp from 'gulp';
import rename from 'gulp-rename';
import sass from 'gulp-sass'; // поддержка SASS (scss)
import babel from 'gulp-babel'; // поддержка ES6 и новых стандартов
import uglify from 'gulp-uglify'; // минифицирование JS
import cleanCSS from 'gulp-clean-css'; // минифицирование CSS
import sourcemaps from 'gulp-sourcemaps';
import imagemin from 'gulp-imagemin'; // минифицирование JPG, GIF, PNG, SVG
import changed from 'gulp-changed'; // кеширование для gulp, в т.ч. между запусками, а не только внутри сессии watch
import path from 'path';
import autoprefixer from 'gulp-autoprefixer'; // авторасстановка префиксов

const base = 'www';
// Дополнительные пути с точкой в начале названий шаблонов прописаны для gulp.watch (он использует chokidar для поиска glob),
// т.к. он не следит за папками с точками без явного указания, в отличие от gulp.src(использует micromatch, в которую передаем опцию dot: true)
const paths = {
	styles: {
		src: [
			'./www/local/templates/*/css/**/!(*.min).?(s)css',
			'./www/local/templates/.*/css/**/!(*.min).?(s)css',

		    './www/local/templates/*/components/**/!(*.min).?(s)css',
		    './www/local/templates/*/components/**/.*/!(*.min).?(s)css',
		    './www/local/templates/.*/components/**/!(*.min).?(s)css',
		    './www/local/templates/.*/components/**/.*/!(*.min).?(s)css',
		],
		dest: './' + base + '/'
	},
	scripts: {
		src: [
			'./www/local/templates/*/js/**/!(*.min).js',
			'./www/local/templates/.*/js/**/!(*.min).js',

		    './www/local/templates/*/components/**/!(*.min).js',
		    './www/local/templates/*/components/**/.*/!(*.min).js',
		    './www/local/templates/.*/components/**/!(*.min).js',
		    './www/local/templates/.*/components/**/.*/!(*.min).js',
		],
		dest: './' + base + '/'
	},
	images: {
		src: [
			'./www/local/templates/*/images/**/!(*.min).+(png|gif|jpg|jpeg|svg)',
			'./www/local/templates/.*/images/**/!(*.min).+(png|gif|jpg|jpeg|svg)',

		    './www/local/templates/*/components/**/images/**/!(*.min).+(png|gif|jpg|jpeg|svg)',
		    './www/local/templates/*/components/**/.*/images/**/!(*.min).+(png|gif|jpg|jpeg|svg)',
		    './www/local/templates/.*/components/**/images/**/!(*.min).+(png|gif|jpg|jpeg|svg)',
		    './www/local/templates/.*/components/**/.*/images/**/!(*.min).+(png|gif|jpg|jpeg|svg)',
		],
		dest: './' + base + '/'
	},
};

export function styles() {
	let oldExtension;

	return gulp.src(paths.styles.src, {dot: true, base: base})
		.pipe(rename(function (path) {
			oldExtension = path.extname;
			path.basename += ".min";
			path.extname = ".css";
		}))
		.pipe(sourcemaps.init())
		.pipe(changed(paths.styles.dest)) // ниже можно вставить в стрим remember(), чтобы забрать из кеша и неизмененные файлы
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer())
		.pipe(cleanCSS())
		.pipe(sourcemaps.mapSources(function(sourcePath, file) {
			sourcePath = path.basename(sourcePath, '.min.css') + oldExtension;
			return sourcePath;
		}))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(paths.styles.dest))
}

export function scripts() {
	return gulp.src(paths.scripts.src, {dot: true, base: base})
		.pipe(sourcemaps.init())
		.pipe(rename({
			suffix: ".min"
		}))
		.pipe(changed(paths.scripts.dest))
		.pipe(babel())
		.pipe(uglify())
		.pipe(sourcemaps.mapSources(function(sourcePath, file) {
			sourcePath = path.basename(sourcePath, '.min.js') + '.js';
			return sourcePath;
		}))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(paths.scripts.dest))
}

export function images() {
	return gulp.src(paths.images.src, {dot: true, base: base})
		.pipe(rename({
			suffix: ".min"
		}))
		.pipe(changed(paths.images.dest))
		.pipe(imagemin())
		.pipe(gulp.dest(paths.images.dest))
}

export function watch() {
	gulp.watch(paths.scripts.src, scripts);
	gulp.watch(paths.styles.src, styles);
	gulp.watch(paths.images.src, images);
}

const build = gulp.series(gulp.parallel(styles, scripts, images), watch);
//gulp.task('build', build);
export default build;