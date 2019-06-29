const {
    watch,
    series,
    src,
    dest,
    lastRun,
    parallel
} = require('gulp');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const del = require('del');
const livereload = require('gulp-livereload');
const imagemin = require('gulp-imagemin');
const htmlmin = require('gulp-htmlmin');
const UglifyJS = require("uglify-js");

const scriptsFile = require('./scripts');
const stylesFile = require('./styles');

const paths = {
    html: {
        src: './client/src/**/*.html',
        dest: 'dist/src/'
    },
    json: {
        src: './client/src/**/*.json',
        dest: 'dist/src/'
    },
    ico: {
        src: './client/src/favicon.ico',
        dest: 'dist/src/'
    },
    flag: {
        src: [
            './client/src/img/flag/**/*.ico',
            './client/src/img/flag/**/*.png'
        ],
        dest: 'dist/src/img/flag'
    },
    styles: {
        src: stylesFile,
        dest: 'dist/src/styles/'
    },
    scripts: {
        src: scriptsFile,
        dest: 'dist/src/scripts/'
    },
    images: {
        src: './client/src/img/**/*.{jpg,jpeg,png}',
        dest: 'dist/src/img/'
    },
};

function clean() {
    return del(['dist']);
};

function styles() {
    return src(paths.styles.src)
        .pipe(concat('main.min.css'))
        .pipe(cleanCSS())
        .pipe(dest(paths.styles.dest))
        .pipe(livereload());
};

function scripts() {
    return src(paths.scripts.src)
        .pipe(babel({
            compact: false
        }))
        .pipe(concat('main.min.js'), UglifyJS.minify())
        .pipe(dest(paths.scripts.dest))
        .pipe(livereload());
};

function images() {
    return src(paths.images.src, {
            since: lastRun(images)
        })
        .pipe(imagemin([
            imagemin.gifsicle({
                interlaced: true
            }),
            imagemin.jpegtran({
                progressive: true
            }),
            imagemin.optipng({
                optimizationLevel: 5
            }),
            imagemin.svgo({
                plugins: [{
                        removeViewBox: true
                    },
                    {
                        cleanupIDs: false
                    }
                ]
            })
        ]))
        .pipe(dest(paths.images.dest))
        .pipe(livereload());
};

function fonts() {
    return src(['./client/node_modules/@fortawesome/fontawesome-free/webfonts/*.*'])
        .pipe(dest('./dist/src/webfonts/'))
        .pipe(livereload());
};

function ico() {
    return src(paths.ico.src)
        .pipe(dest(paths.ico.dest))
        .pipe(livereload());
};

function json() {
    return src(paths.json.src)
        .pipe(dest(paths.json.dest))
        .pipe(livereload());
};

function flag() {
    return src(paths.flag.src)
        .pipe(dest(paths.flag.dest))
        .pipe(livereload());
};

function html() {
    return src(paths.html.src)
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(dest(paths.html.dest))
        .pipe(livereload());
};

function watch_files() {
    devMode = true;
    watch(paths.styles.src, styles);
    watch(paths.scripts.src, scripts);
    watch(paths.json.src, json);
    watch(paths.html.src, html);
};

const dev = parallel(watch_files);
const build = series(clean, parallel(styles, scripts, images, fonts, ico, json, flag, html));

exports.clean = clean;
exports.styles = styles;
exports.scripts = scripts;
exports.html = html;
exports.json = json;
exports.ico = ico;
exports.flag = flag;
exports.images = images;
exports.fonts = fonts;
exports.build = build;
exports.dev = dev;
exports.watch_files = watch_files
exports.default = build, dev;