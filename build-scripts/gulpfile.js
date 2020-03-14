const {
	src,
	dest
} = require('gulp')
const concat = require('gulp-concat')

exports.default = () => {
	return src([__dirname + '/../static/styles.css', __dirname + '/../static/styles/*.css'])
		.pipe(concat('styles.css'))
		.pipe(dest('../static/bundled'));
}