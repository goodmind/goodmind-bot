'use strict';

var gulp = require('gulp');
var config = {
    'dest': './dist',

    'src_html': './src/**/*.ejs',
    'dest_html_src': './dist/**/*.ejs',

    'src_js': './src/**/*.js',
    'dest_js_src': './dist/**/*.js',

    'src_docs': './src',
    'dest_docs': './docs'
};

var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'del', 'run-sequence'],
    rename: {
        'run-sequence': 'sequence'
    }
});

gulp.task('bump', function(){
    return gulp.src('./package.json')
        .pipe($.plumber())
        .pipe($.bump())
        .pipe(gulp.dest('./'));
});



gulp.task('build:clean', function(cb) {
    $.del([
        config.dest_js_src,
        config.dest_html_src
    ], cb);
});

gulp.task('build:docs', function() {
    return gulp.src(config.src_docs)
        .pipe($.esdoc({
            destination: config.dest_docs,
            plugins: [
                {name: 'esdoc-es7-plugin'}
            ]
        }));
});

gulp.task('build:js', function() {
    return gulp.src(config.src_js)
        .pipe($.sourcemaps.init({debug: true}))
        .pipe($.plumber())
        .pipe($.babel({
            stage: 0,
            optional: ['runtime']
        }))
        .pipe($.uglify())
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest(config.dest));
});

gulp.task('build:html', function() {
    return gulp.src(config.src_html)
        .pipe($.plumber())
        .pipe($.minifyHtml())
        .pipe(gulp.dest(config.dest));
});

gulp.task('build', ['build:docs', 'build:js', 'build:html']);


gulp.task('watch:js', function() {
    return gulp.watch(config.src_js, ['build:js']);
});

gulp.task('watch:html', function() {
    return gulp.watch(config.src_html, ['build:html']);
});

gulp.task('watch', ['watch:js', 'watch:html']);



gulp.task('default', function(cb) {
    $.sequence('build:clean', 'build', cb);
});

gulp.task('publish', ['bump', 'default']);
