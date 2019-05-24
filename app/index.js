/* global process, __dirname */
const express = require('express')
const morgan = require('morgan')
const fs = require('fs')
const path = require('path')
const bodyParser = require('body-parser')

const configureRoutes = require('./main.routes')
const app = express()

const { mongoConnect } = require('./util/database')
const { User } = require('./models')

/* Apply Middleware */
app.use(morgan('common'))

// Setup logging a file (in append mode)
var accessLogStream = fs.createWriteStream(
	path.join(__dirname, '..', 'server.log'),
	{
		flags: 'a'
	}
)
app.use(morgan('combined', { stream: accessLogStream }))

/* Demo User Integration */
app.use((req, _, next) => {
	User.findById('5ce557ce7854fe75f8f91c31')
		.then(user => {
			// NOTE: user object from db just has data in it.
			// To get access to User Model methods, create a new User
			req.user = new User({
				name: user.name,
				email: user.email,
				cart: user.cart,
				id: user._id
			})
			next()
		})
		.catch(err => {
			console.log(err)
			next()
		})
})

/* Configure request body parser on different routes */
app.use('/admin', bodyParser.urlencoded({ extended: false }))
app.post('/cart/*', bodyParser.urlencoded({ extended: false }))

/* Opening api access to public folder */
app.use(express.static(path.join(__dirname, '..', 'public')))

/* Setting up ejs template engine */
app.set('view engine', 'ejs')
app.set('views', 'app/views')

/* Add routes */
configureRoutes(app)

const port = process.env.PORT || 8080
const successCb = () =>
	app.listen(port, () => {
		console.log(`Server on http://localhost:${port}`)
	})
const errCb = err => console.log(err)
mongoConnect(successCb, errCb)
