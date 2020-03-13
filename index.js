require('dotenv').config()
const express = require('express')
const storage = require('./modules/storage.js')
const fetcher = require('./modules/api.js')
const utils = require('./modules/utils.js')

const app = express()

//Set path to static assets folder
app.use(express.static('static'))

//Set template engine and path to template folder
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


const port = process.env.PORT || 3000

app.listen(port, () => console.log(`App now listening on port ${port}`))


//Serve index page
app.get('/', (req, res) => {
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
})


//Serve detail page
app.get('/apod/:id', (req, res) => {
	const id = req.params.id
	const data = JSON.parse(storage.getStoredData())

	if (parseInt(id) > data[0].id) {
		console.log('404 page not found!')
		res.render("404", {
			detail: true
		})
	} else {
		res.render("detail", {
			data: data[(data.length - 1) - id]
		})
	}
})


//Serve 404 page not found
app.get('/*', (req, res) => {
	console.log('404 page not found!')
	res.render("404")
})