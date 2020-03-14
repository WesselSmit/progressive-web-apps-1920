const {
	src,
	dest
} = require('gulp')
const cssImport = require('gulp-cssimport')
const rename = require('gulp-rename')

return src([__dirname + '/../static/styles/main.css'])
	.pipe(cssImport())
	.pipe(rename('bundled.css'))
	.pipe(dest(__dirname + '/../static/public/'))