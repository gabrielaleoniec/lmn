/*! 
	* Created on : 2018-02-01, 12:40:21
	* Author     : Gabriela Leoniec <gabriela.leoniec@gmail.com>
**/

var gulp = require('gulp'),
		sass = require('gulp-sass'),
		sassLint = require('gulp-sass-lint'),
		fs = require('fs');

var dir = './public/',
		dir_css = dir+'css/',
		dir_sass = dir_css+'sass/';

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
			/*rules: {
				'class-name-format': {
          'allow-leading-underscore': false,
          'convention': 'camelcase'
        }
			},*/
      configFile: './sass-lint.yml'
		}))
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError());
});
 
gulp.task('sass', ['sasslint'], function () {
  return gulp.src(dir_sass+'*.s+(a|c)ss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(dir_css));
});

gulp.task('sass:watch', function () {
  gulp.watch(dir_sass+'**/*.s+(a|c)ss', ['sass']);
});


gulp.task('default', function () {
	// place code for your default task here
});
