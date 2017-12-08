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
  bs({
    // browser: 'chrome',
    server: {
      baseDir: 'render/FR'
    }
  })
})

// cp img folder
gulp.task('img', ['sass'], function() {
  return gulp.src([src+'**/images/*.{png,jpg,gif}'])
  .pipe(changed('src/**/images/'))
  .pipe(gulp.dest('render'))
  .on('end',function () {
    gulp.start('slim');
  })
})

// sass 
gulp.task('sass', function() {
  return gulp.src(src+'**/scss/*.scss')
  .pipe(sass())
  .pipe(sass({errLogToConsole: true}))
  .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
  .pipe(rename(function(path) {
    path.dirname += "/../css";
  }))
  // .pipe(changed('render#<{(||)}>#css/'))
  .pipe(gulp.dest('render'))
  .pipe(using())
  // .pipe(bs.reload({stream: true }));
})

// slim
gulp.task('slim', function () {
  var slimEnd = false;
  return gulp.src([src+'**/slim/*.slim'])
  // .pipe(slim( {pretty: true, tabsize: 2 }))
  .pipe(slim())
  .on('error', errorLog)
  .pipe(gulp.dest('render')) // slim folder
  .pipe(rename(function(path) {
    path.dirname += "/../";
  }))
  .pipe(foreach(function(stream, file) {
      var fileName = file.path.substr(file.path.lastIndexOf("\\")-2);
      // var myregex = /(.+?)\\/;
      var myregex = fileName.replace(/(.+?)\\.+/,"$1");
      console.log('myregex ' + myregex + '\n fileName ' + fileName + '\n file.path ' + file.path)
      return stream
      .pipe(bs.stream()) // cf premailer task
    }))
  .pipe(gulp.dest('render')) // html folder
  .on('end',function () {
    slimEnd = true;
    premailergo(slimEnd);
  })
});

// premailer
gulp.task('premailer', function (cb) {
  var premailEnd = false;
  gulp.src('render/**/*.html')
  .pipe(premailer())
  .pipe(prettify({indent_car:'', indent_size: 2}))
  .pipe(gulp.dest('render'))
  .on('end',function () {
    premailEnd = true;
    if(cb) {
      console.log('premailerOK: '+premailEnd+' rm render/slim + scss folder; cb = '+cb);
      gulp.start('rmRenderSlimFolder');
      gulp.start('rmRenderCssFolder');
      // run cp fct to continue stream
      cb()
    }
  })
  .pipe(bs.reload({
    stream: true
  }))
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

function premailergo (slimEnd) {
  console.log('slim complete: '+slimEnd);
  if(slimEnd=true){
    gulp.start(['premailer']);
  }else{
    console.log('slim pas prêt.......')
  }
};

// lancement > fonction watch
gulp.task('dev1',['bs','img','slim','sass'], function() {
  gulp.watch([src+'**/images/*.{png,jpg,gif}'],['img']);
  gulp.watch(['source.json',src+'**/slim/*.slim',src+'**/**/*.slim'],['sass', 'slim', 'img']);
  gulp.watch(src+'**/scss/*.scss',['sass', 'slim']);
});