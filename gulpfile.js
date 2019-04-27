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
const imagemin = require('gulp-imagemin');
const livereload = require('gulp-livereload');
const htmlmin = require('gulp-htmlmin');
const UglifyJS = require("uglify-js");
const browserSync = require('browser-sync').create();

const paths = {
    html: {
        src: './client/src/**/*.html',
        dest: 'dist/src/'
    },
    json: {
        src: ['./client/src/**/*.json', ],
        dest: 'dist/src/'
    },
    ico: {
        src: ['./client/src/favicon.ico', ],
        dest: 'dist/src/'
    },
    flag: {
        src: ['./client/src/img/flag/**/*.ico', './client/src/img/flag/**/*.png'],
        dest: 'dist/src/img/flag'
    },
    styles: {
        src: ['./client/src/libs/fontawesome-free-5.6.3-web/css/all.css', './client/src/css/**/*.css'],
        dest: 'dist/src/styles/'
    },
    scripts: {
        src: [
            './client/src/libs/jquery/jquery-3.3.1.min.js',
            './client/src/libs/popper/popper.min.js',
            './client/src/libs/bootstrap-4.2.1-dist/js/bootstrap.js',
            './client/src/libs/fontawesome-free-5.6.3-web/js/all.js',
            './client/src/libs/sidenav/sidenav.min.js',
            './client/src/libs/angular/angular.js',
            './client/src/libs/angular-route/angular-route.js',
            './client/src/libs/angular-cookies-master/angular-cookies.js',
            './client/src/libs/angular-sanitize-master/angular-sanitize.js',
            './client/src/libs/angular-translate-2.18.1/angular-translate.js',
            './client/src/libs/angular-translate-storage-cookie-master/angular-translate-storage-cookie.js',
            './client/src/libs/angular-translate-storage-local-master',
            "./client/src/libs/messageformat/messageformat.js",
            './client/src/libs/angular-translate-loader-url-master/angular-translate-loader-url.js',
            "./client/src/libs/angular-translate-storage-local-master/angular-translate-storage-local.js",
            './client/src/libs/angular-translate-loader-static-files-master/angular-translate-loader-static-files.js',
            './client/src/libs/angular-translate-handler-log-master/angular-translate-handler-log.js',
            './client/src/app/**/*.js'
        ],
        dest: 'dist/src/scripts/'
    },
    images: {
        src: './client/src/img/**/*.{jpg,jpeg,png}',
        dest: 'dist/src/img/'
    },
    webfonts: {
        src: './client/src/libs/fontawesome-free-5.6.3-web/webfonts/**/*.{ttf,eot,svg,woff,woff2}',
        dest: 'dist/src/webfonts/'
    }
};

function clean() {
    return del(['dist']);
}

function styles() {
    return src(paths.styles.src)
        .pipe(concat('main.min.css'))
        .pipe(cleanCSS())
        .pipe(dest(paths.styles.dest))
}

function scripts() {
    return src(paths.scripts.src, {
            sourcemaps: true
        })
        .pipe(babel())
        .pipe(concat('main.min.js'), UglifyJS.minify())
        .pipe(dest(paths.scripts.dest))
}

function html() {
    return src(paths.html.src)
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(dest(paths.html.dest))
}

function ico() {
    return src(paths.ico.src)
        .pipe(dest(paths.ico.dest))
}

function json() {
    return src(paths.json.src)
        .pipe(dest(paths.json.dest))
}

function flag() {
    return src(paths.flag.src)
        .pipe(dest(paths.flag.dest))
}

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
        ])).pipe(dest(paths.images.dest))
}

function webfonts() {
    return src(paths.webfonts.src)
        .pipe(dest(paths.webfonts.dest))
}

function watchFiles() {

    watch(paths.styles.src, styles).on("change", browserSync.reload);
    watch(paths.scripts.src, scripts).on("change", browserSync.reload);
    watch(paths.html.src, html).on("change", browserSync.reload);
    watch(paths.images.src, images).on("change", browserSync.reload);
    watch(paths.ico.src, ico).on("change", browserSync.reload);
    watch(paths.flag.src, flag).on("change", browserSync.reload);
    watch(paths.images.src, images).on("change", browserSync.reload);
    watch(paths.webfonts.src, webfonts).on("change", browserSync.reload);
}

// Static server
function browserSyncStart() {
    browserSync.init(null, {
        proxy: "http://localhost:3000/*",
        files: ["client/**/*.*"],
        port: 8080
    });
};
const dev = series(parallel(browserSyncStart, watchFiles));
const build = series(clean, parallel(styles, scripts, html, json, ico, flag, images, webfonts));

exports.clean = clean;
exports.styles = styles;
exports.scripts = scripts;
exports.html = html;
exports.json = json;
exports.ico = ico;
exports.flag = flag;
exports.images = images;
exports.webfonts = webfonts;
exports.build = build;
exports.dev = dev;
exports.default = build, dev;