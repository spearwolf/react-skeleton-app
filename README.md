## react-skeleton-app

Includes **gulp**, **babel** (_es2015_, _stage-1_, _runtime_, _react_), **browserify** (_commonjs_-style require), **react** .. and more!

All build artifacts goes into `./build/` directory.

Inside your javascripts the global var `DEBUG=(true||false)` is defined.

Babel config is inside `package.json`

### I. install

`npm install`

### II. usage

predefined `gulp` tasks are ..

- `gulp build` &rarr; build `index.html`, one big javascript bundle `app.js` and copy favicon from `src/`to `build/`
- `gulp release` &rarr; same as *build* but with `DEBUG=false`
- `gulp` &rarr; *build* and *watch* (watches only for `src/**/*.js` changes but ignores `src/index.html` or `src/favicon.ico`)
- `gulp serve` &rarr; to run a http server and serve the app at localhost

other sub tasks are ..

- `gulp html`
- `gulp favicon`
- `gulp bundle`
- `gulp bundle:watch`
- `gulp clean`

---

have fun!
