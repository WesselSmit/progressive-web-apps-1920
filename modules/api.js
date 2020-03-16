require('dotenv').config()
const fetch = require('node-fetch')
const cleaner = require('#modules/data.js')
const storage = require('#modules/storage.js')
const utils = require('#modules/utils.js')


const api_key = process.env.api_key
const year = utils.createYYYYMMDDobj().currentYear

module.exports = {
	nasaAPOD: (req, res, month, current) => {
		const monthObj = utils.findMonthObjByName(month)
		const startDate = `${year}-${utils.prefixZero(parseInt(monthObj.index) + 1)}-01`

		let url
		let endDate
		if (current) {
			endDate = `${year}-${utils.prefixZero(parseInt(monthObj.index) + 1)}-${monthObj.days}`
			url = `https://api.nasa.gov/planetary/apod?api_key=${api_key}&start_date=${startDate}&end_date=${endDate}`
		} else {
			const day = utils.createYYYYMMDDobj().currentDay
			endDate = `${year}-${utils.prefixZero(parseInt(monthObj.index) + 1)}-${utils.prefixZero(day)}`
			url = `https://api.nasa.gov/planetary/apod?api_key=${api_key}&start_date=${startDate}&end_date=${endDate}`
		}

		fetch(url)
			.then(response => response.json())
			.then(data => cleaner(data))
			.then(cleanData => storage.saveJSON(cleanData, `./storage/months/${monthObj.name}.json`))
			.then(data => {
				res.render("overview", {
					data
				})
			})
			.catch(err => console.log(`Fetch error: ${err}`))
	}
}