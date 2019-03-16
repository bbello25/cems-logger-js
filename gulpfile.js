var gulp = require('gulp')
var ts = require('gulp-typescript')
var sourcemaps = require('gulp-sourcemaps')

var browserify = require('browserify')
var source = require('vinyl-source-stream')
var buffer = require('vinyl-buffer')
var uglify = require('gulp-uglify')
var log = require('gulplog')
var tsify = require('tsify')
var rename = require("gulp-rename");

gulp.task('build', function() {
  return (
    gulp
      .src(['src/index.ts', "src/CemsLogger.ts", "src/BrowserInfo.ts", "src/BrowserSession.ts", "src/InitializationError.ts", "src/SessionStorageHistoryQueue.ts"])
      .pipe(sourcemaps.init()) // This means sourcemaps will be generated
      .pipe(
        ts({
          declaration: true
        })
      )
      //  .pipe( ... ) // You can use other plugins that also support gulp-sourcemaps
      .pipe(sourcemaps.write('.')) // Now the sourcemaps are added to the .js file
      .pipe(gulp.dest('dist'))
  )
})

gulp.task('browserify', function() {
  return browserify({
    debug: true,
    entries: ['src/index.ts', "src/CemsLogger.ts", "src/BrowserInfo.ts", "src/BrowserSession.ts", "src/InitializationError.ts", "src/SessionStorageHistoryQueue.ts"],
    standalone: 'lib',
  })
    .on('error', console.error.bind(console))
    .plugin(tsify)
    .bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(gulp.dest('demo'))
    .pipe(rename('app.min.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('demo'))
})
