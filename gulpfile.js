const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const rename = require('gulp-rename');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const cleanCss = require('gulp-clean-css');
const imagemin = require('gulp-imagemin');
const htmlmin = require('gulp-htmlmin');
const favicons = require('gulp-favicons');
const filter = require('gulp-filter');
const webp = require('gulp-webp');
const del = require('del');


const paths = {
    styles: {
        src: './src/sass/**/*.scss',
        dest: './f/css/'
    },
    scripts: {
        src: './src/js/main/*.js',
        dest: './f/js/'
    },
    plugins: {
        src: './src/js/plugins/*.js',
        dest: './f/js/'
    },
    images: {
        src: './src/i/images/**/*',
        dest: './f/i/'
    },
    webp: {
        src: './src/i/webp/**/*',
        dest: './f/i/webp/'
    },
    html: {
        src: './src/html/**/*',
        dest: './'
    },
    favicons: {
        src: './src/i/favicon/*',
        dest: './f/i/favicons'
    }
}

//Очистка директории
function clean(){
    return del([paths.styles.dest])
}

//Сборка, добавление префиксов и минификация main.css из папки src/sass/images/. Сохраняет в папку /f/css/.
function maincss(){
    return gulp.src('./src/sass/main.scss')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(cleanCss())
        .pipe(concat('main.min.css'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./f/css/'))
}

//Сборка и минификация скриптов из папки src/js/main/. Сохраняет в папку /f/js/.
function scripts(){
    return gulp.src(paths.scripts.src,{
        sourcemap: true
    })
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets:['@babel/env']
        }))
        .pipe(uglify())
        .pipe(concat('main.min.js'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(paths.scripts.dest))
}

//Сборка и минификация плагин-скриптов из папки src/js/plugins/. Сохраняет в папку /f/js/.
function plugins(){
    return gulp.src(paths.plugins.src,{
        sourcemap: true
    })
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets:['@babel/env']
        }))
        .pipe(uglify())
        .pipe(concat('plugins.min.js'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(paths.plugins.dest))
}

//Минификация HTML из папки src/html/. Сохраняет в корень проекта.
function html(){
    return gulp.src(paths.html.src)
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest(paths.html.dest));
}

//Сжатие изображений из папки src/i/images/. Сохраняет в папку /f/i/.
function images(){
    return gulp.src(paths.images.src)
        .pipe(imagemin())
        .pipe(gulp.dest(paths.images.dest))
}

//Конвертер изображений в формат webp из папки src/i/webp/. Сохраняет в папку /f/i/webp/.
function webpconv(){
    return gulp.src(paths.webp.src)
        .pipe(webp())
        .pipe(gulp.dest(paths.webp.dest))
}

//Создание favicon картинок и manifest.json из папки src/i/favicon/. Сохраняет в папку /f/i/favicons/ и копирует от туда 'favicon.ico', 'favicon-48x48.png', 'apple-touch-icon.png', 'manifest.json' в корень проекта
function fav(){
    return gulp.src(paths.favicons.src)
        .pipe(favicons({
            settings: { background: '#1d1d1d' , vinylMode: true },
            icons: {
                favicons: true,
                appleIcon: true,
                android: true,
                windows: false,
                yandex: false,
                coast: false,
                firefox: false,
                appleStartup: false
            },
            appName: 'Название',
            appDescription: 'Описание',
            lang: 'ru',
            path: paths.favicons.dest
        }, function(code) {
            console.log(code);
        }))
        .pipe(gulp.dest(paths.favicons.dest))
        .pipe(filter(['favicon.ico', 'favicon-48x48.png', 'apple-touch-icon.png', 'manifest.json']))
        .pipe(gulp.dest('./'));
}


//Слежение за изменениями в файлах
function watch(){
    gulp.watch(paths.styles.src, maincss)
    gulp.watch(paths.scripts.src, scripts)
    gulp.watch(paths.html.src, html)
}

const build = gulp.series(clean, gulp.parallel(maincss, scripts, images, webpconv, fav, plugins, html), watch)

exports.clean = clean
exports.images = images
exports.webpconv = webpconv
exports.fav = fav
exports.maincss = maincss
exports.scripts = scripts
exports.plugins = plugins
exports.html = html
exports.watch = watch
exports.build = build
exports.default = build