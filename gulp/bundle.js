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
const cssModulesify = require('css-modulesify');
const postcssModulesLocalByDefault = require('postcss-modules-local-by-default');
const postcssModulesExtractImports = require('postcss-modules-extract-imports');
const postCssModulesScope = require('postcss-modules-scope');
const precss = require('precss');
const autoprefixer = require('autoprefixer');

module.exports = function (taskName, srcDir, bundleJs, bundleCss, buildDir, standalone, babelConfig, logNamespace) {

    if (!logNamespace) logNamespace = bundleJs;

    gulp.task(taskName, () => bundle(build()).pipe(exit()));

    gulp.task(taskName + ':release', () => bundle(build({
            browserify: {
                debug: false
            },
            cssModulesify: {
                generateScopedName: cssModulesify.generateShortName
            }
        }), {
            writeSourcemaps: false,
            uglify: {
                preserveComments: 'license',
                compress: {
                    global_defs: {
                        DEBUG: false
                    }
                }
            }
        }).pipe(exit()));

    gulp.task(taskName + ':watch', () => {

        let b = build();
        b.on('update', bundle.bind(global, b, null));
        bundle(b);

    });

    function build (options) {

        if (options === undefined) options = {};
        let browserifyOptions = options.browserify || {};
        let cssModulesifyOptions = options.cssModulesify || {};

        var b = watchify(browserify(Object.assign({
            entries: srcDir + '/' + bundleJs,
            debug: true,
            bundleExternal: true,
            standalone: standalone,
            cache: {},
            packageCache: {},
        }, browserifyOptions)));

        b.on('log', gutil.log.bind(gutil, '[' + gutil.colors.cyan(logNamespace) + ']'));

        b.transform('babelify', Object.assign({ sourceMapRelative: '.' }, babelConfig));

        b.plugin(cssModulesify, Object.assign({
            output: buildDir + '/' + bundleCss,
            use: [
                postcssModulesLocalByDefault,
                postcssModulesExtractImports,
                postCssModulesScope,
                precss,
                autoprefixer
            ]
        }, cssModulesifyOptions));

        return b;

    }

    function bundle ( b, options ) {

        if (options == null) {
            options = {
                writeSourcemaps: true,
                uglify: {
                    mangle: false,
                    preserveComments: 'all',
                    compress: {
                        sequences     : false, // true,  // join consecutive statemets with the “comma operator”
                        properties    : false, // true,  // optimize property access: a["foo"] → a.foo
                        dead_code     : false, // true,  // discard unreachable code
                        drop_debugger : false, // true,  // discard “debugger” statements
                        unsafe        : false, // some unsafe optimizations (see below)
                        conditionals  : false, // true,  // optimize if-s and conditional expressions
                        comparisons   : false, // true,  // optimize comparisons
                        evaluate      : false, // true,  // evaluate constant expressions
                        booleans      : false, // true,  // optimize boolean expressions
                        loops         : false, // true,  // optimize loops
                        unused        : false, // true,  // drop unused variables/functions
                        hoist_funs    : false, // true,  // hoist function declarations
                        hoist_vars    : false, // hoist variable declarations
                        if_return     : false, // true,  // optimize if-s followed by return/continue
                        join_vars     : false, // true,  // join var declarations
                        cascade       : false, // true,  // try to cascade `right` into `left` in sequences
                        side_effects  : false, // true,  // drop side-effect-free statements
                        warnings      : true,  // warn about potentially dangerous optimizations/code
                        global_defs: {         // global definitions
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
            b = b.pipe(sourcemaps.init({
                loadMaps: false,
                debug: true,
                addComment: true,
            }));
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
        };
    }

}
