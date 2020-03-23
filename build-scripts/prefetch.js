require('dotenv').config()
const fetch = require('node-fetch')
const fs = require('fs')
const Axios = require('axios')
const utils = require('#modules/utils.js')
const {
	src,
	dest
} = require('gulp')
const imagemin = require("gulp-imagemin")
const extReplace = require("gulp-ext-replace")
const webp = require("imagemin-webp")

async function prefetch() {
	const api_key = process.env.api_key
	const now = utils.createYYYYMMDDobj()
	const startDate = utils.createStartYearDate()
	const endDate = `${now.currentYear}-${utils.prefixZero(now.currentMonth)}-${utils.prefixZero(now.currentDay)}`
	const url = `https://api.nasa.gov/planetary/apod?api_key=${api_key}&start_date=${startDate}&end_date=${endDate}`

	fetch(url)
		.then(response => response.json())
		.then(data => download(data))
		.then(() => {
			//todo: dit werkt niet omdat de .then() getriggered word wanneer de function gecomplete is maar dan zijn de JPGs nog niet weggeschreven naar de folder 
			//todo: --> en dus kan je ze nog niet naar webp converten
			//TODO: maak hier een while loop die zichzelf elke 100ms aanroept totdat '/storage/images' bestaat en alle images heeft
			setTimeout(() => {
				// while(fs.)
				JPGtoWEBP()
			}, 5000);
		})
		.catch(err => console.log(`Fetch error: ${err}`))
}
prefetch()

async function download(data) {
	data.map(apod => {
		if (apod.media_type === 'image') {
			//Followed tutorial: https://www.youtube.com/watch?time_continue=393&v=jAJzji5UxnU&feature=emb_logo
			Axios({
					method: 'GET',
					url: apod.url,
					responseType: 'stream'
				})
				.then(res => {
					let name = apod.url.split('/')
					name = name[name.length - 1]

					res.data.pipe(fs.createWriteStream(`./storage/images/${name}`))

					return new Promise((resolve, reject) => {
						res.data.on('end', () => {
							resolve()
						})

						res.data.on('error', err =>
							reject(err)
						)
					})
				})
		}
	})
}


function JPGtoWEBP() {
	return src(__dirname + "/../storage/images/**/*.jpg")
		.pipe(
			imagemin({
				verbose: true,
				plugins: webp({
					quality: 70
				})
			})
		)
		.pipe(extReplace(".webp"))
		.pipe(dest(__dirname + "/../static/images"))
}