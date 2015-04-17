var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

gulp.task('default', function() {
  gulp.src('emitter.js')
    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter('default'))
    .pipe(plugins.uglify())
    .pipe(plugins.rename({suffix: '.min'}))
    .pipe(gulp.dest('.'));
});

gulp.task('test', function() {
  return gulp.src('./test/test.js', {read: false})
            .pipe(plugins.mocha());
});
