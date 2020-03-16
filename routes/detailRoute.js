// const storage = require('../modules/storage.js')

const storage = require('#modules/storage.js')

module.exports = (req, res) => {
	const id = req.params.id
	const data = JSON.parse(storage.getStoredData())

	if (parseInt(id) > data[0].id) {
		res.render("404", {
			detail: true
		})
	} else {
		res.render("detail", {
			data: data[(data.length - 1) - id]
		})
	}
}