(function () {
    'use strict';

    var gulp = require('gulp'),
        gutil = require("gulp-util"),
        del = require('del'),
        beautify = require("gulp-jsbeautifier"),
        uglify = require("gulp-uglify"),
        rename = require("gulp-rename"),
        header = require('gulp-header'),
        sourcemaps = require('gulp-sourcemaps'),
        browserSync = require('browser-sync').create();

    var pkg = require('./package.json');
    var banner = ['/**',
        ' * <%= pkg.name %>',
        ' * @version v<%= pkg.version %>',
        ' * @link <%= pkg.homepage %>',
        ' * @license <%= pkg.license %>',
        ' */',
        ''].join('\n');

    gulp.task('beautify', function() {
        gulp.src(['./src/*.css', './src/*.js'])
            .pipe()
            .pipe(gulp.dest('./lib'));
    });

    gulp.task('dist:clean', function () {
        del.sync('./dist', {force: true});
        del.sync('./lib', {force: true});
    });

    gulp.task('dist:copy:js', function() {
        return gulp
                .src('./src/jquery-debounce-plugin.js')
                .pipe(rename('jquery-debounce-plugin-' + pkg.version + '.js'))
                .pipe(gulp.dest('./dist/js'));
    });

    gulp.task('dist:copy', ['dist:copy:js']);

    gulp.task('dist:script', ['dist:clean'], function () {
        return gulp.src('./src/*.js')
            .pipe(sourcemaps.init())
            .pipe(uglify())
            .pipe(rename('jquery-debounce-plugin-' + pkg.version + '.min.js'))
            .pipe(header(banner, {pkg: pkg}))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest('./dist/js'))
            .on('error', gutil.log)
    });

//     gulp.task('dev:serve', ['dist:clean', 'dist:copy', 'dist:sass', 'dist:styles'], function() {
//         browserSync.init({
//             port: 3000,
//             server: "./"
//         });
//         gulp.watch('./src/*.scss', ['simple-sass']);
//         gulp.watch('./*.html').on('change', browserSync.reload);
//     });

    gulp.task('default', ['dist:clean', 'dist:copy', 'dist:script'], function (cb) {
        gutil.log('Info :', gutil.colors.green('Distribution files v.' + pkg.version + ' are ready!'));
        cb(null)
    });

//     gulp.task('dev', ['dist:clean', 'dist:sass', 'dist:styles', 'dist:script', 'dev:serve'], function (cb) {
//         gutil.log('Info :', gutil.colors.green('Build complete!'));
//         gutil.log('Info :', gutil.colors.green('Opening browser on http://localhost:3000/'));
//         cb(null)
//     });

})();