var gulp      = require("gulp");
var premailer = require('gulp-premailer');

module.exports = function () {
  // promise = start prettify
  gulp.task('premailer', function () {
    return Promise.all([
      new Promise(function (resolve, reject) {
        gulp.src('render/**/*.html')
        .pipe(premailer())
        .pipe(gulp.dest('render'))
        // .pipe(bs.stream())
        .on('end', resolve)
      })
    ]).then(function () {
      console.log('premailer terminé run prettify + bs')
      gulp.start('prettify');
    })
  });

}