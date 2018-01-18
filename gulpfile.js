require("./tasks/img.js")();
require("./tasks/slim.js")();
// lire la note sur dependance de sass cf sass.js
require("./tasks/sass.js")();
// to disable>dest path replace fs
var gulp         = require('gulp'),
    bs           = require('browser-sync'),
    plumber      = require('gulp-plumber'),
    rename       = require('gulp-rename'),
    rimraf       = require('rimraf'),
    using        = require('gulp-using'),
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
});

function reportChange(event){
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
}

gulp.task('build', ['bs'], function () {
  gulp.watch(src+'**/images/*.{png,jpg,gif}',['img']).on('change', reportChange);
  gulp.watch(['source.json', src+'**/**/*.slim', src+'**/scss/*.scss'], ['slim']).on('change', reportChange);
})

gulp.task('dev1',['img','slim'], function() {
  gulp.start('build')
});
