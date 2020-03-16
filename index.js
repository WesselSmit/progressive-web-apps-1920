require('dotenv').config()
const port = process.env.PORT || 3000
const express = require('express')
const route_home = require('#routes/homeRoute.js')
const route_detail = require('#routes/detailRoute.js')
const route_month = require('#routes/monthRoute.js')
const app = express()


//Set path to static assets folder
app.use(express.static('static'))


//Set template engine & path to template folder
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


//Routes
app.get('/', (req, res) => route_home(req, res))
app.get('/apod/:id', (req, res) => route_detail(req, res))
app.get('/month/:id', (req, res) => route_month(req, res))
app.get('/*', (req, res) => res.render("404"))


//Set port to host app
app.listen(port, () => console.log(`App now listening on port ${port}`))