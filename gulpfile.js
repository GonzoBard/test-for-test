// npm i --save-dev gulp gulp-sass gulp-postcss autoprefixer gulp-clean-css gulp-sourcemaps gulp-rename run-sequence del browser-sync

const gulp = require('gulp');
const del = require('del');                              // удалить директорию, файл
const autoprefixer = require('autoprefixer');            // https://github.com/postcss/autoprefixer#gulp
const postcss = require('gulp-postcss');                 // здесь нужен для автопрефиксера
const sass = require('gulp-sass');                       // трансляция SCSS -> CSS
const cleancss = require('gulp-clean-css');              // минификация CSS
const sourcemaps = require('gulp-sourcemaps');           // маппит bundle на исходники -- только для разработки
const rename = require('gulp-rename');                   // переименовать директорию, файл
const runsequence = require('run-sequence');             // некоторые задачи надо выполнять последовательно
const browsersync = require('browser-sync').create();    // сервер с поддержкой автообновления при изменении файлов

const paths = {
  src: {
    fonts: './src/fonts/*.{woff2,woff}',
    html: './src/html/**/*.html',
    img: './src/img/**/*.{jpg,png,svg}',
    js: './src/js/**/*.js',
    scss: './src/scss/style.scss',
    scssforwatch: './src/scss/**/*.scss'
  },
  output: {
    fonts: './build/fonts',
    html: './build',
    img: './build/img',
    js: './build/js',
    css: './build/css',
    cssName: 'bundle.min.css',
  },
  build: './build'
};

gulp.task('clean', () => {
  return del(paths.build, {force: true});
});

gulp.task('fonts', () => {
  return gulp.src(paths.src.fonts)
    .pipe(gulp.dest(paths.output.fonts));
});

gulp.task('html', () => {
  return gulp.src(paths.src.html)
    .pipe(gulp.dest(paths.output.html));
});

gulp.task('img', () => {
  return gulp.src(paths.src.img)
    .pipe(gulp.dest(paths.output.img));
});

gulp.task('js', () => {
  return gulp.src(paths.src.js)
    .pipe(gulp.dest(paths.output.js))
    .pipe(browsersync.stream());
});

gulp.task('css', () => {
  return gulp.src(paths.src.scss)
  //.pipe(sourcemaps.init())                      // debug
    .pipe(sass())                                 // SCSS -> CSS
    .pipe(postcss([autoprefixer({                 // префиксы
      browsers: ['last 2 versions', 'not ie 10']
    })]))
    .pipe(cleancss({                              // минификация
      level: {1: {specialComments: false}}
    }))
    //.pipe(sourcemaps.write())                   // debug
    .pipe(rename(paths.output.cssName))
    .pipe(gulp.dest(paths.output.css))
    .pipe(browsersync.stream());
});

gulp.task('syncserver', () => {
  browsersync.init({
    server: {
      baseDir: paths.build
    }
  });
  gulp.watch(paths.src.html, ['html']).on('change', browsersync.reload);
  gulp.watch(paths.src.js, ['js']);
  gulp.watch(paths.src.scssforwatch, ['css']);
});

gulp.task('build', () => {
  runsequence('clean', ['fonts', 'html', 'img', 'js', 'css', 'syncserver']);
});
