'use strict';

var gulp = require("gulp"),
//    wiredep = require('wiredep').stream;
//useref = require('gulp-useref'),
//    uglify = require('gulp-uglify'),
//    clean = require('gulp-clean'),
//    gulpif = require('gulp-if'),
//    filter = require('gulp-filter'),
//    size = require('gulp-size'),
//    imagemin = require('gulp-imagemin'),
//    concatCss = require('gulp-concat-css'),
//    minifyCss = require('gulp-minify-css'),
    // jade = require('gulp-jade'),
    // prettify = require('gulp-prettify'),
    sass = require('gulp-sass'),
    // autoprefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload;

// Подключаем ссылки на bower компоненты
gulp.task('wiredep', function () {
    gulp.src('app/*.html')
        .pipe(wiredep())
        .pipe(gulp.dest('app/'))
});

// Очистка папки
gulp.task('clean', function () {
    return gulp.src('dist')
        .pipe(clean())
});

// Переносим html, css, js в папку dist
gulp.task('useref', function () {
    var assets = useref.assets();
    return gulp.src('app/*.html')
        .pipe(assets)
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss({
            compatibility: 'ie8'
        })))
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(gulp.dest('dist'));
});

// Перенос шрифтов
gulp.task('fonts', function () {
    gulp.src('app/fonts/*')
        .pipe(filter(['*.eot', '*.svg', '*.ttf', '*.woff', '*.woff2']))
        .pipe(gulp.dest('dist/fonts/'));
});

// Картинки
gulp.task('images', function () {
    return gulp.src('app/img/**/*')
        .pipe(imagemin({
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest('dist/img'));
});

// Остальные файлы, такие как favicon.ico и пр.
gulp.task('extras', function () {
    return gulp.src([
        'app/*.*',
        '!app/*.html'
    ]).pipe(gulp.dest('dist'));
});

// Сборка и вывод размера содержимого папки dist
gulp.task('dist', ['useref', 'images', 'fonts', 'extras'], function () {
    return gulp.src('dist/**/*').pipe(size({
        title: 'build'
    }));
});

// Собираем папку Dist
gulp.task('build', ['clean'], function () {
    gulp.start('dist');
});

// Компилируем Jade в html
// gulp.task('jade', function () {
//     gulp.src('app/templates/pages/*.jade')
//         .pipe(jade())
//         .on('error', log)
//         .pipe(prettify({
//             indent_size: 2
//         }))
//         .pipe(gulp.dest('app/'))
//         .pipe(reload({
//             stream: true
//         }));
// });

// Компилируем Sass в css
gulp.task('sass', function () {
    gulp.src('app/sass/*.scss')
        .pipe(sass())
        .on('error', log)
        .pipe(gulp.dest('app/css'))
        .pipe(reload({
            stream: true
        }));
});

// Добавляем автопрефиксы
gulp.task('autoprefixer', function () {
    return gulp.src('app/css/*.css')
        .pipe(autoprefixer({
            browsers: ['last 15 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('dist/css/'));
});

// Запускаем локальный сервер (только после компиляции jade)
gulp.task('server', ['sass'], function () {
    browserSync({
        notify: false,
        port: 9000,
        server: {
            baseDir: 'app'
        }
    });
});


// слежка и запуск задач
gulp.task('watch', function () {
    // gulp.watch('app/templates/**/*.jade', ['jade']);
    gulp.watch('app/sass/*.scss', ['sass']);
    gulp.watch([
        'app/*.html',
        'app/js/**/*.js',
        'app/css/**/*.css'
    ]).on('change', reload);
});

// Задача по-умолчанию
gulp.task('default', ['server', 'watch']);

// Более наглядный вывод ошибок
var log = function (error) {
    console.log([
        '',
        "----------ERROR MESSAGE START----------",
        ("[" + error.name + " in " + error.plugin + "]"),
        error.message,
        "----------ERROR MESSAGE END----------",
        ''
    ].join('\n'));
    this.end();
}
