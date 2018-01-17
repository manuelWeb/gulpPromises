require("./tasks/img.js")();
require("./tasks/slim.js")();
// to disable>dest path replace fs
var gulp         = require('gulp'),
    bs           = require('browser-sync'),
    slim         = require("gulp-slim"),
    sass         = require('gulp-sass'),
    plumber      = require('gulp-plumber'),
    premailer    = require('gulp-premailer'),
    autoprefixer = require('gulp-autoprefixer'),
    rename       = require('gulp-rename'),
    using        = require('gulp-using'),
    rm           = require('gulp-rimraf'),
    rimraf       = require('rimraf'),
    prettify     = require('gulp-html-prettify'),
    foreach      = require("gulp-foreach"),
    changed      = require('gulp-changed');

// src & output
var  src = 'src/';
// delete old folder before start dev task
gulp.task('dev', function (cb) {
  rimraf('./render', function cb () {
    console.log('render is destroyed : clean is over.\nlet\'s work on clean folder!');
    gulp.start('dev1');
  });
});


// browser-sync task !attention index.html obligatoire
gulp.task('bs',function () {
  bs({
    server: {
      baseDir: 'render/FR'
    }
  })
})

// sass 
gulp.task('sass', function() {
  // .pipe(using())
  // // .pipe(bs.reload({stream: true }));
  return Promise.all([
    new Promise(function (resolve, reject) {
      gulp.src(src+'**/scss/*.scss')
      .pipe(sass({errLogToConsole: true}))
      .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
      .pipe(rename(function(path) {
        path.dirname += "/../css";
      }))
      // .pipe(changed('render#<{(||)}>#css/'))
      .pipe(gulp.dest('render'))
      .on('end', resolve)
    })
  ]).then(function () {
    console.log('sass terminé run premailer')
    gulp.start('premailer');
  })
})
// premailer
gulp.task('premailer', function () {
  return Promise.all([
    new Promise(function (resolve, reject) {
      gulp.src('render/**/*.html')
      .pipe(premailer())
      .pipe(prettify({indent_car:'', indent_size: 2}))
      .pipe(gulp.dest('render'))
      .on('end', resolve)
      .pipe(bs.reload({stream: true }))
    })
  ]).then(function () {
    console.log('premailer terminé run bs')
  }).then(function () {
    rimraf('./render/**/slim',function (err) {
      console.log("all done del slim");
    });
    rimraf('./render/**/css',function (err) {
      console.log("all done del css");
    });
  }).then(function () {
    console.log('THE END!!!!!!!!!')
    // gulp.start('bs');
  })
});

function reportChange(event){
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
}
gulp.task('dev1',['img','slim','bs'], function() {
  // outputs changes to files to the console
  gulp.watch(src+'**/images/*.{png,jpg,gif}',['img']).on('change', reportChange);
  gulp.watch(['source.json', src+'**/**/*.slim'],['slim']).on('change', reportChange);
});
// gulp.task('dev1',['img','bs'], function() {
//   // outputs changes to files to the console
//   gulp.watch(['source.json', src+'**/images/*.{png,jpg,gif}',src+'**/**/*.slim',src+'**/scss/*.scss'],['img']).on('change', reportChange);
// });
