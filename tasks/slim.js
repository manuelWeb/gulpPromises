var gulp    = require("gulp");
var slim    = require("gulp-slim");
var foreach = require("gulp-foreach");
var rename  = require('gulp-rename');
// with Promise
module.exports = function () {
  gulp.task('slim', function () {
    return Promise.all([
      new Promise(function (resolve, reject) {
        gulp.src(['src/**/slim/*.slim'])
        .pipe(slim())
        .on('error', reject)
        .pipe(gulp.dest('render')) // render/slim/ folder
        .pipe(rename(function(path) {
          path.dirname += "/../";
        }))
        .pipe(foreach(function(stream, file) {
          var fileName = file.path.substr(file.path.lastIndexOf("\\")-2);
          var myregex = fileName.replace(/(.+?)\\.+/,"$1");
            // console.log('myregex ' + myregex + '\n fileName ' + fileName + '\n file.path ' + file.path)
          return stream
          // .pipe(bs.stream()) // cf premailer task
        }))
        .pipe(gulp.dest('render')) // html folder
        .on('end', resolve)
      })
    ]).then(function () {
      console.log('slim terminé run sass');
      gulp.start('sass');
    })
  });
}
