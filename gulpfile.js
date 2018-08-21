var gulp        = require('gulp');
var browserSync = require('browser-sync');
var cp          = require('child_process');
var sass = require('gulp-sass');
var postcss    = require('gulp-postcss');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('autoprefixer');
var watch = require('gulp-watch');
var uglify = require('gulp-uglify');
var cssnano = require('cssnano');
var imagemin = require('gulp-imagemin');
var htmlhint = require("gulp-htmlhint");

// var messages = {
//     jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
// };
// Gulp as asset manager for jekyll. Please note that the assets folder is never cleaned
//so you might want to manually delete the src/assets folder once in a while.
// this is because gulp will move files from the assets directory to src/assets,
// but it will not remove them from src/assets if you remove them from assets.

/**
 * Build the Jekyll Site - for windos. If you are on a Mac/linux change jekyll.bat to just jekyll
 */
// gulp.task('jekyll-build', function (done) {
//     browserSync.notify(messages.jekyllBuild);
//     return cp.spawn('jekyll', ['build'], {stdio: 'inherit'})
//         .on('close', done);
// });

/**
 * Rebuild Jekyll & do page reload when watched files change
 */
// gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
//     browserSync.reload();
// });

/**
 * Wait for jekyll-build, then launch the Server
 */

// gulp.task('serve', ['jekyll-build'], function() {
// gulp.task('serve', function() {
//     browserSync.init({
//         watch: true,
//         server: "assets/",
//         browser: "google chrome"
//     });
// });

/**
 * Watch jekyll source files for changes, don't watch assets
 */
// gulp.task('watch', function () {
//     gulp.watch(['**/*.*', '!src/**/*','!assets/**/*','!node_modules/**/*','!.sass-cache/**/*' ],['jekyll-rebuild']);
// });

gulp.task('sass', function () {  
    var plugins = [
        autoprefixer({browsers: [
            'last 3 version',
            'Chrome >= 35',
            'Firefox >= 38',
            'Edge >= 10',
            'Explorer >= 10',
            'ie >= 10',
            'iOS >= 8',
            'Safari >= 8',
            'Android 2.3',
            'Android >= 4',
            'Opera >= 12'
        ]}),
        cssnano()
    ];
     return gulp.src('assets/scss/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(sourcemaps.init())
    .pipe(postcss(plugins))
    .pipe(sourcemaps.write('.'))
    .pipe( gulp.dest('src/assets/css/') )
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('browser-sync', function() {  
    browserSync.init(["assets/**/*","src/*.html"], {
        server: {
            port:'3138',
            watch: true,
            browser: "chrome",
            baseDir: "./src",
            proxy: "0.0.0.0:3138"
        }
    });
});

gulp.task('default', ['browser-sync', 'sass', 'imagemin','watch-js'], function () {  
    gulp.watch("assets/scss/*.scss", ['sass']);
});

// watch just the js files
gulp.task('watch-js', ['js-rebuild'], function() {
     gulp.watch(['assets/js/**/*.js','assets/js/*.js'], ['js-rebuild']);
});

// watch just the image files
// gulp.task('watch-images', ['images-rebuild'], function() {
//      gulp.watch(['assets/img/**/*.*'], ['images-rebuild']);
// });

//if sass files change just rebuild them with gulp-sass and what not
// gulp.task('sass-rebuild', function() {
//      var plugins = [
//         autoprefixer({browsers: ['last 2 version']}),
//         cssnano()
//     ];
//      return gulp.src('assets/sass/**/*.scss')
//     .pipe(sourcemaps.init())
//     .pipe(sass())
//     .pipe(sourcemaps.init())
//     .pipe(postcss(plugins))
//     .pipe(sourcemaps.write('.'))
//     .pipe( gulp.dest('src/assets/css/') )
//     .pipe(browserSync.reload({
//       stream: true
//     }))
// });

gulp.task('js-rebuild', function(cb) {
    return gulp.src('assets/js/*.js')
      //.pipe(uglify())
      .pipe( gulp.dest('src/assets/js/') )
      .pipe(browserSync.reload({
      stream: true
    }))
});

// gulp.task('images-rebuild', function(cb) {
   
//      return gulp.src('assets/img/**/*.*')
//       .pipe( gulp.dest('src/assets/img/') )
//       .pipe(browserSync.reload({
//       stream: true
//     }))
// });

/**
 * Default task, running just `gulp` will 
 * compile the jekyll site, launch BrowserSync & watch files.
 */
// gulp.task('default', ['serve', 'watch','watch-sass','watch-js','watch-images']);


//build and deploy stuff
gulp.task('imagemin', function() {
    console.log('Minimizing images in source!!');
 return gulp.src('assets/img/**/*')
    .pipe(imagemin())
    .pipe(gulp.dest(function (file) {
        return file.base;
    }));
});

gulp.task('w3', function() {
gulp.src("src/**/*.html")
    .pipe(htmlhint())
    .pipe(htmlhint.reporter())
})
// validate from the command line instead, works better
// npm install htmlhint -g
// htmlhint src/**/*.html
