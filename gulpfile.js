// Load plugins
var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    ts = require('gulp-typescript'),
    watch = require('gulp-watch'),
    server = require('gulp-develop-server'),
    del = require('del');
// server
gulp.task( 'server:start', function() {
    server.listen( { path: './server.js' } );
});

// css
gulp.task('css', function() {
  return sass('src/css/common.scss',{ style: 'expanded', "sourcemap=none": true})
    .on('error',notify.onError(function (error) {return 'Sass error!'}))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .on('error',notify.onError(function (error) {return 'Sass error!'}))
    .pipe(gulp.dest('dist/css'))
    .on('error',notify.onError(function (error) {return 'Sass error!'}))
    .pipe(rename({ suffix: '.min' }))
    .on('error',notify.onError(function (error) {return 'Sass error!'}))
    .pipe(minifycss())
    .on('error',notify.onError(function (error) {return 'Sass error!'}))
    .pipe(gulp.dest('dist/css'))
    .on('error',notify.onError(function (error) {return 'Sass error!'}))
    //.pipe(notify({ message: 'css task complete' }));
});
// js
gulp.task('jslib', function(){
  return gulp.src('src/js/libs/*.js')
    .pipe(gulp.dest('dist/js/libs'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .on('error',notify.onError(function (error) {return 'Jslib error!'}))
    .pipe(gulp.dest('dist/js/libs'))
    //.pipe(notify({ message: 'jslib task complete' }));
});
gulp.task('ts', function(){
  return gulp.src('src/js/*.ts')
    .pipe(ts({
      noImplicitAny: true
    }))
    .on('error',notify.onError(function (error) {return 'Ts error!'}))
    .pipe(gulp.dest('dist/js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .on('error',notify.onError(function (error) {return 'Ts error!'}))
    .pipe(gulp.dest('dist/js'))
    //.pipe(notify({ message: 'ts task complete' }));
});
gulp.task('js', function() {
  return gulp.src('src/js/*.js')
    //.pipe(concat('main.js'))
    .pipe(gulp.dest('dist/js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .on('error',notify.onError(function (error) {return 'Js error!'}))
    .pipe(gulp.dest('dist/js'))
    //.pipe(notify({ message: 'js task complete' }));
});
// font
gulp.task('font', function(){
  return gulp.src('src/font/**')
    .pipe(gulp.dest('dist/font'))
    .on('error',notify.onError(function (error) {return 'Font error!'}))
    //.pipe(notify({ message: 'font task complete' }));
});
// img
gulp.task('img', function() {
  return gulp.src('src/img/**')
    //.pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .on('error',notify.onError(function (error) {return 'Img error!'}))
    .pipe(gulp.dest('dist/img'))
    .on('error',notify.onError(function (error) {return 'Img error!'}))
    //.pipe(notify({ message: 'img task complete' }));
});
// Watch
gulp.task('watch', function() {
  // Watch .scss files
  watch('src/css/**/*.scss', function(){
    gulp.start('css');
  });
  // Watch .js files
  watch('src/js/libs/*.js', function(){
    gulp.start('jslib');
  });
  watch('src/js/*.ts', function(){
    gulp.start('ts');
  });
  watch('src/js/*.js', function(){
    gulp.start('js');
  });
  // Watch image files
  watch('src/img/**', function(){
    gulp.start('img');
  });
  // Watch font files
  watch('src/font/**', function(){
    gulp.start('font');
  });
  // Create LiveReload server
  livereload.listen();
  // Watch any files in dist/, reload on change
  watch(['**/*.html','dist/**/*'],function(file){
    livereload.changed(file.path);
  });
  // Watch server.js to restart intime
  watch('server.js', function(){
    server.restart();
  });
});

//develop
gulp.task('develop', ['server:start', 'font', 'css', 'jslib', 'ts', 'js', 'img', 'watch']);

//clean
// 清空图片、样式、js
gulp.task('clean', function(cb) {
  return del(['dist/css', 'dist/js','dist/img','dist/font'],cb);
});

// gulp命令默认启动的就是default认为,这里将clean任务作为依赖,也就是先执行一次clean任务,流程再继续.
gulp.task('default', ['clean'], function() {
  gulp.start('develop');
});

