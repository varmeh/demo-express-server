/* global process, __dirname */
const express = require('express')
const morgan = require('morgan')
const fs = require('fs')
const path = require('path')
const bodyParser = require('body-parser')

const configureRoutes = require('./routes')
const app = express()

/* Apply Middleware */
app.use(morgan('common'))

// Setup logging a file (in append mode)
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'server.log'), {
	flags: 'a'
})
app.use(morgan('combined', { stream: accessLogStream }))

app.use('/product', bodyParser.urlencoded({ extended: false }))

/* Opening api access to public folder */
app.use(express.static(path.join(__dirname, 'public')))

/* Setting up ejs template engine */
app.set('view engine', 'ejs')
app.set('views', 'views')

/* Add routes */
configureRoutes(app)

const port = process.env.PORT || 8080
app.listen(port, () => {
	console.log(`Server on http://localhost:${port}`)
})
