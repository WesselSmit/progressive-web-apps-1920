const {
	src,
	dest
} = require('gulp')
const cssImport = require('gulp-cssimport')
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename')

return src([__dirname + '/../static/styles/main.css'])
	.pipe(cssImport())
	.pipe(cleanCSS({
		compatibility: 'ie8'
	}))
	.pipe(rename('bundled.css'))
	.pipe(dest(__dirname + '/../static/public/'))