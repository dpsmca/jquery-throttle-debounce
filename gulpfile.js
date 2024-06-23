const { series, parallel, src, dest, watch } = require('gulp');
const gutil = require("gulp-util");
const del = require('delete');
const beautify = require("gulp-jsbeautifier");
const uglify = require("gulp-uglify");
const rename = require("gulp-rename");
const header = require('gulp-header');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();
const pkg = require('./package.json');

var banner = ['/**',
    ' * <%= pkg.name %>',
    ' * @version v<%= pkg.version %>',
    ' * @link <%= pkg.homepage %>',
    ' * @license <%= pkg.license %>',
    ' */',
    ''].join('\n');

async function beautifyTask(cb) {
    return src(['./src/*.css', './src/*.js'])
        .pipe(beautify())
        .pipe(dest('./lib'));
}

async function distClean(cb) {
    del.sync('./dist', {force: true});
    del.sync('./lib', {force: true});
}

async function distCopyJs(cb) {
    return src('./src/jquery-debounce-plugin.js')
            .pipe(rename('jquery-debounce-plugin-' + pkg.version + '.js'))
            .pipe(dest('./dist/js'));
}

async function distCopy(cb) {
    return series(distCopyJs);
}

async function distScript(cb) {
    return src('./src/*.js')
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(rename('jquery-debounce-plugin-' + pkg.version + '.min.js'))
        .pipe(header(banner, {pkg: pkg}))
        .pipe(sourcemaps.write('./'))
        .pipe(dest('./dist/js'))
        .on('error', gutil.log)
}

function buildTask(cb) {
    return series(distClean, distCopy, distScript);
}

async function startBuildTask() {
    gutil.log(gutil.colors.green('Building ' + pkg.name + ' v' + pkg.version + ' ...'));
}

async function finishBuildTask() {
    gutil.log('Info :', gutil.colors.green('Distribution files v' + pkg.version + ' are ready!'));
}

function watchTask() {
    watch('src/*.js', series(startBuildTask, distCopyJs, distScript));
}

exports.beautify = beautifyTask;
exports.clean = distClean;
exports.copy = distCopy;
exports.script = distScript;
exports.build = series(startBuildTask, distClean, distCopyJs, distScript, finishBuildTask);
exports.watch = series(distClean, watchTask);
exports.default = series(startBuildTask, distClean, distCopyJs, distScript, finishBuildTask);

//     gulp.task('dev:serve', ['dist:clean', 'dist:copy', 'dist:sass', 'dist:styles'], function() {
//         browserSync.init({
//             port: 3000,
//             server: "./"
//         });
//         gulp.watch('./src/*.scss', ['simple-sass']);
//         gulp.watch('./*.html').on('change', browserSync.reload);
//     });

// gulp.task('default', ['dist:clean', 'dist:copy', 'dist:script'], );

//     gulp.task('dev', ['dist:clean', 'dist:sass', 'dist:styles', 'dist:script', 'dev:serve'], function (cb) {
//         gutil.log('Info :', gutil.colors.green('Build complete!'));
//         gutil.log('Info :', gutil.colors.green('Opening browser on http://localhost:3000/'));
//         cb(null)
//     });

