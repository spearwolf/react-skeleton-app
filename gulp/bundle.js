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

    gulp.task(taskName + ':release', () => bundle(build({
            debug: false
        }), {
            writeSourcemaps: false,
            uglify: {
                compress: {
                    global_defs: {
                        DEBUG: false
                    }
                }
            }
        }).pipe(exit()));

    gulp.task(taskName + ':watch', () => {

        let b = build();
        b.on('update', bundle.bind(global, b));
        bundle(b);

    });

    function build (options) {

        var b = watchify(browserify(Object.assign({
            entries: srcDir + '/' + bundleJs,
            debug: true,
            bundleExternal: true,
            standalone: standalone,
        }, options||{})));

        b.transform('babelify', Object.assign({ sourceMapRelative: '.' }, babelConfig));

        b.on('log', gutil.log.bind(gutil, '[' + gutil.colors.cyan(logNamespace) + ']'));

        return b;

    }

    function bundle ( b, options ) {

        if (options === undefined) {
            options = {
                writeSourcemaps: true,
                uglify: {
                    compress: {
                        global_defs: {
                            DEBUG: true
                        }
                    }
                }
            };
        }

        b = b.bundle()
            .on('error', log_error('Browserify'))
            .pipe(source(bundleJs))
            .pipe(buffer());

        if (options.writeSourcemaps) {
            b = b.pipe(sourcemaps.init({ loadMaps: true }));
        }

        b = b.pipe(uglify(options.uglify));

        if (options.writeSourcemaps) {
            b = b.on('error', log_error('Sourcemaps')).pipe(sourcemaps.write('./'));
        }

        return b.pipe(gulp.dest(buildDir));

    }

    function log_error ( prefix ) {
        let log = gutil.log.bind(gutil, '[' + gutil.colors.cyan(logNamespace) + ']', gutil.colors.red(prefix));
        return function ( err ) {
            log(gutil.colors.red(err.toString()));
            //gutil.log(JSON.stringify(err, null, 2));
        };
    }

}
