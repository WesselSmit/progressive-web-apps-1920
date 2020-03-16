const storage = require('#modules/storage.js')
const fetcher = require('#modules/api.js')
const utils = require('#modules/utils.js')

module.exports = (req, res) => {
	const month = req.params.id

	if (storage.checkIfFileExists(`./storage/months/${month}.json`)) {
		const data = storage.getStoredData(`./storage/months/${month}.json`)
		if (utils.isMonthCurrentMonth(month) && !utils.checkDates(data)) {
			fetcher.nasaAPOD(req, res, month, false)
		} else {
			res.render("overview", {
				data
			})
		}

	} else {
		if (utils.isMonthCurrentMonth(month)) {
			fetcher.nasaAPOD(req, res, month, false)
		} else {
			fetcher.nasaAPOD(req, res, month, true)
		}
	}
}