const storage = require('#modules/storage.js')

module.exports = (req, res) => {
	const month = req.params[0]
	const id = req.params.id
	const data = storage.getStoredData(`./storage/months/${month}.json`)
	const apod = data[id]

	if (parseInt(id) > data.length - 1) {
		res.render("404", {
			detail: true
		})
	} else {
		res.render("detail", {
			data: apod
		})
	}
}