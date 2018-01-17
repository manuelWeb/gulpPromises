var gulp         = require("gulp");
var sass         = require('gulp-sass');
var rename       = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var premailer    = require('gulp-premailer');
var bs           = require('browser-sync');
var prettify     = require('gulp-html-prettify');
var rimraf       = require('rimraf');
const mess = "premailer mais sans le rendu slim pas de preiview dans le browser"
// Promise 
module.exports = function () {
  gulp.task('sass', function() {
    // .pipe(bs.reload({stream: true }));
    return Promise.all([
      new Promise(function (resolve, reject) {
        gulp.src('src/**/scss/*.scss')
        .pipe(sass({errLogToConsole: true}))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(rename(function(path) {
          path.dirname += "/../css";
        }))
        .pipe(gulp.dest('render'))
        .on('end', resolve)
      })
    ]).then(function () {
      console.log(`sass terminé run premailer sinon pas de rendu HTML !!!`)
      gulp.start('premailer');
    })
  });
// premailer
gulp.task('premailer', function () {
  return Promise.all([
    new Promise(function (resolve, reject) {
      gulp.src('render/**/*.html')
      .pipe(premailer())
      .pipe(prettify({indent_car:'', indent_size: 2}))
      .pipe(gulp.dest('render'))
      .pipe(bs.reload({stream: true }))
      .on('end', resolve)
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
  })
});
}

// attention sass et dépendant de slim du fait de l'injection des styles en ligne de premailer et ce dans chaque country/index.html. Pour cette raison le watch de scss/**/*.scss est inclut au watch de slim.