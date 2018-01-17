require("./tasks/img.js")();
require("./tasks/slim.js")();
// lire la note sur dependance de sass cf sass.js
require("./tasks/sass.js")();
// to disable>dest path replace fs
var gulp         = require('gulp'),
    bs           = require('browser-sync'),
    plumber      = require('gulp-plumber'),
    premailer    = require('gulp-premailer'),
    rename       = require('gulp-rename'),
    using        = require('gulp-using'),
    rm           = require('gulp-rimraf'),
    rimraf       = require('rimraf'),
    prettify     = require('gulp-html-prettify'),
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

gulp.task('dev1',['img','slim','sass','bs'], function() {
  // outputs changes to files to the console
  gulp.watch(src+'**/images/*.{png,jpg,gif}',['img']).on('change', reportChange);
  gulp.watch(['source.json', src+'**/**/*.slim', src+'**/scss/*.scss'], ['slim']).on('change', reportChange);
});
