const gulp = require('gulp');
const bundleTasks = require('./gulp/bundle');
const htmlTask = require('./gulp/html');
const serveTask = require('./gulp/serve');
const packageJson = require('./package.json');
const del = require('del');

const srcDir = 'src';
const bundleJs = 'index.js';
const bundleCss = 'app.css';
const indexHtml = 'index.html';
const standalone = 'App';
const buildDir = 'build';
const servePort = 1975;

bundleTasks('bundle', srcDir, bundleJs, bundleCss, buildDir, standalone, packageJson.babel);
htmlTask('html', srcDir + '/' + indexHtml, buildDir, Object.assign({ bundleJs: bundleJs, bundleCss: bundleCss, standalone: standalone }, packageJson));
serveTask('serve', servePort, buildDir);

gulp.task('clean', () => del(['build/**/*']));

gulp.task('favicon', () => {
    gulp.src('src/favicon.ico', { base: 'src' }).pipe(gulp.dest('build'));
});

gulp.task('build', ['html', 'favicon', 'bundle']);
gulp.task('release', ['clean', 'html', 'favicon', 'bundle:release']);

gulp.task('default', ['html', 'favicon', 'bundle:watch']);
