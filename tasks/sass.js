var gulp         = require("gulp");
var sass         = require('gulp-sass');
var rename       = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');

// Promise 
module.exports = function () {

  gulp.task('sass', function() {
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
      console.log(`sass terminé run premailer sinon
pas de rendu HTML !!!`)
      gulp.start('premailer');
    })
  });

}

// attention sass et dépendant de slim du fait de l'injection des styles en ligne de premailer et ce dans chaque country/index.html. Pour cette raison le watch de scss/**/*.scss est inclut au watch de slim.