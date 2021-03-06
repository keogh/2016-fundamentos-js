'use strict';

var gulp = require('gulp');
var fs = require('fs');
var browserSync = require('browser-sync');
var program = require('commander');

var gReplace = require('gulp-replace');
var buffer = require('gulp-buffer');
var include = require('gulp-include');
var ignore = require('gulp-ignore');
var imagemin = require('gulp-imagemin');

program
  .option('-p, --prod', 'enforce production environment')
  .option('-c, --compress', 'produce a zip package')
  .parse(process.argv);

gulp.task('build:all', [
  'build:images',
  'build:gifs',
  'build:fonts',
  'build:slides',
  'build:css',
  'build:vendors'
]);

gulp.task('build:images', function () {
  return gulp.src(['./assets/**/*.jpg', './assets/**/*.png'])
    .pipe(imagemin())
    .pipe(gulp.dest('./build/assets/'))
    .pipe(browserSync.reload({stream: true, once: true}));
});

gulp.task('build:gifs', function () {
  return gulp.src(['./assets/**/*.gif'])
    .pipe(gulp.dest('./build/assets/'))
    .pipe(browserSync.reload({stream: true, once: true}));
});

gulp.task('build:fonts', function () {
  return gulp.src('./assets/fonts/**/*')
    .pipe(gulp.dest('./build/assets/fonts'))
    .pipe(browserSync.reload({stream: true, once: true}));
});

gulp.task('build:slides', function () {
  var slides = [];
  JSON.parse(fs.readFileSync('./src/slides.json', 'utf8')).slides.forEach(function (slide) {
    slides.push('slides/' + slide + '.md');
  });

  var replacement = '//= include ' + JSON.stringify(slides);

  return gulp.src('./src/index.html')
    .pipe(gReplace(/\<\!\-\- replace\:slides \-\-\>/, replacement))
    .pipe(include())
    .pipe(gulp.dest('./build/'))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('build:css', function () {
  return gulp.src('./src/stylesheets/*.css')
    .pipe(gulp.dest('./build/css/'))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('build:vendors', function () {
  var bowerConfig = JSON.parse(fs.readFileSync('./.bowerrc', 'utf8'));

  var src = [
    './' + bowerConfig['directory'] + '/remark/out/*.js'
  ];

  return gulp.src(src)
    .pipe(ignore('*.ts'))
    .pipe(gulp.dest('./build/js/'));
});