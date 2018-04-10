// npm i --save-dev del gulp gulp-sass gulp-postcss autoprefixer gulp-concat gulp-clean-css gulp-sourcemaps run-sequence

const del = require('del');                         // удалить директорию, файл
const gulp = require('gulp');
const autoprefixer = require('autoprefixer');       // https://github.com/postcss/autoprefixer#gulp
const postcss = require('gulp-postcss');
const concat = require('gulp-concat');              // собирает все файлы в один файл - делает bundle
const sass = require('gulp-sass');
const cleanсss = require('gulp-clean-css');         // минификация CSS
const sourcemaps = require('gulp-sourcemaps');      // маппит bundle на исходники
const runsequence = require('run-sequence');        // некоторые задачи надо выполнять последовательно

const config = {
  src: {
    fonts: './src/fonts/*.{woff2,woff}',
    html: './src/html/**/*.html',
    img: './src/img/**/*.{jpg,png,svg}',
    js: './src/js/**/*.js',
    scss: './src/scss/style.scss',
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
  return del(config.build, {force: true});
});

gulp.task('fonts', () => {
  return gulp.src(config.src.fonts)
    .pipe(gulp.dest(config.output.fonts));
});

gulp.task('html', () => {
  return gulp.src(config.src.html)
    .pipe(gulp.dest(config.output.html));
});

gulp.task('img', () => {
  return gulp.src(config.src.img)
    .pipe(gulp.dest(config.output.img));
});

gulp.task('js', () => {
  return gulp.src(config.src.js)
    .pipe(gulp.dest(config.output.js));
});

gulp.task('css', () => {
  return gulp.src(config.src.scss)
  //.pipe(sourcemaps.init())
    .pipe(sass())                                           // scss->css
    .pipe(concat(config.output.cssName))                    // делает bundle, хотя на входе и один файл
    .pipe(postcss([autoprefixer({                           // префиксы
      browsers: ['last 2 versions', 'not ie 10']
    })]))
    .pipe(cleanсss({                                        // минификация
      level: {1: {specialComments: false}}
    }))
    //.pipe(sourcemaps.write())
    .pipe(gulp.dest(config.output.css));
});

gulp.task('build', () => {
  runsequence('clean', ['fonts', 'html', 'img', 'js', 'css']);
});

