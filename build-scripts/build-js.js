const {
	src,
	dest
} = require('gulp')
const minify = require('gulp-minify')
const rename = require('gulp-rename')

//ServiceWorker
src([__dirname + '/../static/serviceWorker.js'])
	.pipe(minify({
		noSource: true
	}))
	.pipe(rename('optimizedSW.js'))
	.pipe(dest(__dirname + '/../static/'))

//Clientside JS files
return src([__dirname + '/../static/scripts/filter.js'])
	.pipe(minify({
		noSource: true
	}))
	.pipe(rename('optimized.js'))
	.pipe(dest(__dirname + '/../static/public/'))