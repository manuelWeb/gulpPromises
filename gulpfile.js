require("./tasks/img.js")();
require("./tasks/slim.js")();
require("./tasks/sass.js")();// lire note dependance sass.js
require("./tasks/premailer.js")();
require("./tasks/prettify.js")();
// to disable>dest path replace fs
var global_end = false;
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
  bs.init({
    server: {
      baseDir: 'render/FR',
      index: 'index.html'
    }
  })
});

const reportChange = (event) => {
  console.log("\x1b[30m\x1b[43m%s\x1b[0m", `File: ${event.path}, type was ${event.type}, running tasks... var global_end = ${global_end}`);
};

gulp.task('dev1',['img','slim'], function() {
  gulp.start('build');
});


gulp.task('build', ['bs'], function (cb) {
  gulp.watch(src+'**/images/*.{png,jpg,gif}',['img']).on('change', reportChange);
  gulp.watch(['source.json', src+'**/**/*.slim', src+'**/scss/*.scss'], ['slim']).on('change', reportChange);
})

