'use strict';

const gulp = require('gulp');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const gutil = require('gulp-util');
const watchify = require('watchify');
const exit = require('gulp-exit');

module.exports = function (taskName, srcDir, bundleJs, buildDir, standalone, babelConfig, logNamespace) {

    if (!logNamespace) logNamespace = bundleJs;

    gulp.task(taskName, () => bundle(build()).pipe(exit()));

    gulp.task(taskName + ':watch', () => {

        let b = build();
        b.on('update', bundle.bind(global, b));
        bundle(b);

    });

    function build () {

        var b = watchify(browserify({
            entries: srcDir + '/' + bundleJs,
            debug: true,
            bundleExternal: true,
            standalone: standalone,
        }))

        b.transform('babelify', Object.assign({ sourceMapRelative: '.' }, babelConfig));

        b.on('log', gutil.log.bind(gutil, '[' + gutil.colors.cyan(logNamespace) + ']'));

        return b;

    }

    function bundle ( b ) {

        return b.bundle()
            .on('error', log_error('Browserify'))
            .pipe(source(bundleJs))
            .pipe(buffer())
            .pipe(sourcemaps.init({ loadMaps: true }))
            .pipe(uglify())
            .on('error', log_error('Sourcemaps'))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(buildDir))
            ;

    }

    function log_error ( prefix ) {
        let log = gutil.log.bind(gutil, '[' + gutil.colors.cyan(logNamespace) + ']', gutil.colors.red(prefix));
        return function ( err ) {
            log(gutil.colors.red(err.toString()));
            //gutil.log(JSON.stringify(err, null, 2));
        };
    }

}
