var gulp = require('gulp');
var sass = require('gulp-sass');
var nodemon = require('gulp-nodemon');

gulp.task('sass', function () {
  gulp.src('./public/scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./public/css'));
});

gulp.task('dev', function () {
  nodemon({
    script: 'app.js'
  })
  gulp.watch('./public/scss/**/*.scss', ['sass']);
});
