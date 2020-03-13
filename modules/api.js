require('dotenv').config()
const fetch = require('node-fetch')
const cleaner = require('../modules/data.js')
const storage = require('../modules/storage.js')
const utils = require('../modules/utils.js')


module.exports = fetcher = {
	api: (req, res) => {
		const start_date = utils.createStartYearDate()
		const api_key = process.env.api_key
		const url = `https://api.nasa.gov/planetary/apod?api_key=${api_key}&start_date=${start_date}`

		fetch(url)
			.then(response => response.json())
			.then(data => cleaner(data))
			.then(cleanData => utils.orderData(cleanData))
			.then(orderedData => storage.saveJSON(orderedData))
			.then(data => {
				res.render("overview", {
					data
				})
			})
			.catch(err => console.log(`Fetch error: ${err}`))
	}
}