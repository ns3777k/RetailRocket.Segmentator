const gulp = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const clean = require('gulp-clean');

gulp.task('clean', () => {
    return gulp.src('dist', {read: false})
        .pipe(clean());
});

gulp.task('build', ['clean'], () => {
    return gulp.src('src/*')
        .pipe(babel({babelrc: true}))
        .pipe(gulp.dest('dist'))
        .pipe(sourcemaps.init())
            .pipe(uglify())
            .pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['build'], () => {});
