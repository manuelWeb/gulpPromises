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
const notifier   = require('node-notifier');

// src & output
var  src = 'src/';
// delete old folder before start dev task
gulp.task('dev', function (cb) {
  rimraf('./render', function cb () {
    console.log('render is destroyed : clean is over!\nlet\'s work on clean folder!');
    gulp.start('dev1');
  });
});
// gestion erreur
function errorLog(error) {
  // console.log(error.toString());
  notifier.notify({
    'title': 'Gulp Error !!!',
    'message': "1-Show Console Error to debug" 
    +"\n 2-Kill gulp process ctrl+c"
    +"\n 3-debug error"
  });
  console.log(error.toString());
}

// browser-sync task !attention index.html obligatoire
gulp.task('bs',function () {
  return Promise.all([
    new Promise(function (resolve, reject) {
      resolve(bs({
              // browser: 'chrome',
              server: {
                baseDir: 'render/FR'
              }
            }))
    })
  ]).then(function () {
    console.log('rendu terminé supp fold slim + css')
  })
  //     gulp.start('rmRenderSlimFolder');
  //     gulp.start('rmRenderCssFolder');
})

// cp img folder
gulp.task('img', function() {
  return Promise.all([
    new Promise( function(resolve, reject){
      gulp.src([src+'**/images/*.{png,jpg,gif}'])
      .pipe(gulp.dest('render'))
      .on('end', resolve)
    })
  ]).then( function () {
    console.log('task img ok task suivant : task slim...');
    gulp.start('slim');
  });
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

// slim
gulp.task('slim', function () {
  return Promise.all([
    new Promise(function (resolve, reject) {
      gulp.src([src+'**/slim/*.slim'])
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
          .pipe(bs.stream()) // cf premailer task
        }))
      .pipe(gulp.dest('render')) // html folder
      .on('end', resolve)
    })
  ]).then(function () {
    console.log('slim terminé run sass');
    gulp.start('sass');
  })
});

// premailer
gulp.task('premailer', function (cb) {
  return Promise.all([
    new Promise(function (resolve, reject) {
      gulp.src('render/**/*.html')
      .pipe(premailer())
      .pipe(prettify({indent_car:'', indent_size: 2}))
      .pipe(gulp.dest('render'))
      .on('end', resolve)
    })
  ]).then(function () {
    console.log('premailer terminé run bs')
    gulp.start('bs');
  })
  // .on('end',function () {
  //   premailEnd = true;
  //   if(cb) {
  //     console.log('premailerOK: '+premailEnd+' rm render/slim + scss folder; cb = '+cb);
  //     gulp.start('rmRenderSlimFolder');
  //     gulp.start('rmRenderCssFolder');
  //     // run cp fct to continue stream
  //     cb()
  //   }
  // })
  // .pipe(bs.reload({
  //   stream: true
  // }))
});

gulp.task('rmRenderSlimFolder', function (cb) {
  rimraf('./render/**/slim',function (err) {
    console.log("all done del slim");
    return cb(null);
  });
});
gulp.task('rmRenderCssFolder', function (cb) {
  rimraf('./render/**/css',function (err) {
    console.log("all done del css");
    return cb(null);
  });
});

// lancement > fonction watch
// gulp.task('dev1',['bs','img','slim','sass'], function() {
//   gulp.watch([src+'**/images/*.{png,jpg,gif}'],['img']);
//   gulp.watch(['source.json',src+'**/slim/*.slim',src+'**/**/*.slim'],['sass', 'slim', 'img']);
//   gulp.watch(src+'**/scss/*.scss',['sass', 'slim']);
// });
gulp.task('dev1',['img'], function() {
  gulp.watch(['source.json', src+'**/images/*.{png,jpg,gif}',src+'**/**/*.slim',src+'**/scss/*.scss'],['img']);
});