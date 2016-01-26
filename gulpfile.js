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
    del = require('del');
// font
gulp.task('font', function(){
  return gulp.src('src/font/**')
    .pipe(gulp.dest('dist/font'))
    //.pipe(notify({ message: 'font task complete' }));
});
// css
gulp.task('css', function() {
  return sass('src/css/common.scss',{ style: 'expanded' })
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(gulp.dest('dist/css'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(minifycss())
    .pipe(gulp.dest('dist/css'))
    //.pipe(notify({ message: 'css task complete' }));
});
// js
gulp.task('jslib', function(){
  return gulp.src('src/js/libs/*.js')
    .pipe(gulp.dest('dist/js/libs'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js/libs'))
    //.pipe(notify({ message: 'jslib task complete' }));
});
gulp.task('ts', function(){
  return gulp.src('src/js/*.ts')
    .pipe(ts({
      noImplicitAny: true
    }))
    .pipe(gulp.dest('dist/js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
    //.pipe(notify({ message: 'ts task complete' }));
});
gulp.task('js', function() {
  return gulp.src('src/js/*.js')
    //.pipe(concat('main.js'))
    .pipe(gulp.dest('dist/js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
    //.pipe(notify({ message: 'js task complete' }));
});
// img
gulp.task('img', function() {
  return gulp.src('src/img/**')
    //.pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('dist/img'))
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
  watch('dist/**',function(){
    livereload.changed();
  });
});

//develop
gulp.task('develop', ['font', 'css', 'jslib', 'ts', 'js', 'img', 'watch']);

//clean
// 清空图片、样式、js
gulp.task('clean', function(cb) {
  return del(['dist/css', 'dist/js','dist/img','dist/font'],cb);
});

// gulp命令默认启动的就是default认为,这里将clean任务作为依赖,也就是先执行一次clean任务,流程再继续.
gulp.task('default', ['clean'], function() {
  gulp.start('develop');
});