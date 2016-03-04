const gulp = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');

gulp.task('default', () => {
    return gulp.src('src/*')
        .pipe(babel({
            babelrc: true
        }))
        .pipe(gulp.dest('dist'))
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('dist'));
});
