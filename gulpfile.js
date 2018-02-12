/*! 
	* Created on : 2018-02-01, 12:40:21
	* Author     : Gabriela Leoniec <gabriela.leoniec@gmail.com>
**/

var gulp = require('gulp'),
		sass = require('gulp-sass'),
		sassLint = require('gulp-sass-lint'),
		fs = require('fs'),
    jshint = require('gulp-jshint'),
    sourcemaps = require('gulp-sourcemaps');
    

var dir = './public/',
		dir_css = dir+'css/',
		dir_sass = dir_css+'sass/';
		dir_js = dir+'js/';

fs.lstat(dir, (err) => {
    if(err)
        return console.log(err); //Handle error
		}
); 
fs.lstat(dir_sass, (err) => {
    if(err)
        return console.log(err); //Handle error
		}
); 
fs.lstat(dir_css, (err) => {
    if(err)
        return console.log(err); //Handle error
		}
); 

gulp.task('sasslint', function () {
  return gulp.src(dir_sass+'**/*.s+(a|c)ss')
    .pipe(sassLint({
      configFile: './sass-lint.yml'
		}))
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError());
});

gulp.task('lint', function() {
  return gulp.src(dir_js+'/src/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});
 
gulp.task('sass', ['sasslint'], function () {
  return gulp.src(dir_sass+'*.s+(a|c)ss')
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(sourcemaps.write("./maps", {includeContent: false}))
    .pipe(gulp.dest(dir_css));
});

gulp.task('sass:watch', function () {
  gulp.watch(dir_sass+'**/*.s+(a|c)ss', ['sass']);
});


gulp.task('default', ['sass', 'lint'], function () {
	// place code for your default task here
});
