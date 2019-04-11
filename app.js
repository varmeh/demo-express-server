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

/* Add routes */
configureRoutes(app)

const port = process.env.PORT || 8080
app.listen(port, () => {
	console.log(`Server on http://localhost:${port}`)
})
