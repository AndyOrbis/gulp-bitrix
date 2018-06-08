//TODO наблюдать за новыми папками
//TODO should we use pump?
//TODO проверить, что все пути на sass/css/js в браузерах показывают полностью правильно

import gulp from 'gulp';
import rename from 'gulp-rename';
import sass from 'gulp-sass'; // поддержка SASS (scss)
import babel from 'gulp-babel'; // поддержка ES6 и новых стандартов
import uglify from 'gulp-uglify'; // минифицирование JS
import cleanCSS from 'gulp-clean-css'; // минифицирование и расстановка префиксов в CSS
import sourcemaps from 'gulp-sourcemaps'; //TODO промежуточный sourcemap на sass, а не на css после обработки sass()
import imagemin from 'gulp-imagemin'; // минифицирование JPG, GIF, PNG, SVG
import changed from 'gulp-changed'; // кеширование для gulp, в т.ч. между запусками, а не только внутри сессии watch

const base = 'www';
const paths = {
	styles: {
		src: ['./www/local/templates/*/css/**/!(*.min).?(s)css',
		      './www/local/templates/*/components/**/!(*.min).?(s)css'
		],
		dest: './' + base + '/'
	},
	scripts: {
		src: ['./www/local/templates/*/js/**/!(*.min).js',
		      './www/local/templates/*/components/**/!(*.min).js'
		],
		dest: './' + base + '/'
	},
	images: {
		src: ['./www/local/templates/*/images/**/!(*.min).+(png|gif|jpg|jpeg|svg)',
		      './www/local/templates/*/components/**/images/**/!(*.min).+(png|gif|jpg|jpeg|svg)'
		],
		dest: './' + base + '/'
	},
};

export function styles() {
	return gulp.src(paths.styles.src, {dot: true, base: base})
		.pipe(rename({
			suffix: ".min",
			extname: ".css"
		}))
		.pipe(changed(paths.styles.dest)) // ниже можно вставить в стрим remember(), чтобы забрать из кеша и неизмененные файлы
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(cleanCSS()) //TODO можно задать настройки по необходимым браузерам
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(paths.styles.dest))
}

export function scripts() {
	return gulp.src(paths.scripts.src, {dot: true, base: base})
		.pipe(rename({
			suffix: ".min"
		}))
		.pipe(changed(paths.scripts.dest))
		.pipe(sourcemaps.init())
		.pipe(babel())
		.pipe(uglify())
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