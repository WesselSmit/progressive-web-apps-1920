const storage = require('../modules/storage.js')
const fetcher = require('../modules/api.js')
const utils = require('../modules/utils.js')

module.exports = (req, res) => {
	if (storage.checkIfFileExists()) {
		const data = JSON.parse(storage.getStoredData())
		const equalDates = utils.checkDates(data)

		if (equalDates) {
			res.render("overview", {
				data
			})
		} else {
			fetcher.api(req, res)
		}
	} else {
		fetcher.api(req, res)
	}
}