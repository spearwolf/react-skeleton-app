const gulp = require('gulp');
const bundleTasks = require('./gulp/bundle');
const htmlTask = require('./gulp/html');
const serveTask = require('./gulp/serve');
const packageJson = require('./package.json');

const srcDir = 'src';
const bundleJs = 'app.js';
const indexHtml = 'index.html';
const standalone = 'App';
const buildDir = 'build';
const servePort = 1975;

bundleTasks('bundle', srcDir, bundleJs, buildDir, standalone, packageJson.babel);
htmlTask('html', srcDir + '/' + indexHtml, buildDir, Object.assign({ bundleJs: bundleJs }, packageJson));
serveTask('serve', servePort, buildDir);

gulp.task('favicon', () => {
    gulp.src('src/favicon.ico', { base: 'src' }).pipe(gulp.dest('build'));
});

gulp.task('default', ['html', 'favicon', 'bundle:watch']);
