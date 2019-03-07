var gulp = require('gulp')
var ts = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
 
 

gulp.task('scripts', function() {
    return gulp.src('src/*.ts')
        .pipe(sourcemaps.init()) // This means sourcemaps will be generated
        .pipe(ts({
            declaration: true
        }))
      //  .pipe( ... ) // You can use other plugins that also support gulp-sourcemaps
        .pipe(sourcemaps.write(".")) // Now the sourcemaps are added to the .js file
        .pipe(gulp.dest('dist'));
});