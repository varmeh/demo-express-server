/* global process, __dirname */
const express = require('express')
const morgan = require('morgan')
const fs = require('fs')
const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const session = require('express-session')
const MongodbStore = require('connect-mongodb-session')(session)
const csrf = require('csurf')
const flash = require('connect-flash')

const configureRoutes = require('./main.routes')
const { logError, errorHandler, ErrorCustom } = require('./error.manager')
const app = express()

const { User } = require('./models')

const MONGODB_URI = process.env.MONGO_URI
const SESSION_SECRET = process.env.SESSION_SECRET

/* Apply Middleware */
app.use(morgan('common'))

/* Create a temporary session store */
const sessionStore = new MongodbStore({
	uri: MONGODB_URI,
	collection: 'sessions'
})
app.use(
	session({
		secret: SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		store: sessionStore
	})
)

// Setup logging a file (in append mode)
var accessLogStream = fs.createWriteStream(
	path.join(__dirname, '..', 'server.log'),
	{
		flags: 'a'
	}
)
app.use(morgan('combined', { stream: accessLogStream }))

/* Integrate default user */
app.use(async (req, _res, next) => {
	if (req.session.user === undefined) {
		next()
	} else {
		try {
			const user = await User.findById(req.session.user._id)
			if (!user) {
				return next(new ErrorCustom('User not found', 'Forbidden', 401))
			}
			// Session only stores information while User method provides a full blown user model.
			req.user = user
			next()
		} catch (err) {
			next(new ErrorCustom(err.message, 'System Error', 408))
		}
	}
})

/* Configure request body parser on different routes */
app.post('/*', bodyParser.urlencoded({ extended: false }))

/* CSRF Protection */
// Note: This should be done after body parser, else node does not get _csrf in form body.
const csrfProtection = csrf()
app.use(csrfProtection)

app.use(flash())

/* Following variables are available to all responses as local variable */
app.use((req, res, next) => {
	res.locals.isAuthenticated = req.session.user != null
	res.locals.csrfToken = req.csrfToken()
	next()
})

/* Opening api access to public folder */
app.use(express.static(path.join(__dirname, '..', 'public')))

/* Setting up ejs template engine */
app.set('view engine', 'ejs')
app.set('views', 'app/views')

/* Add routes */
configureRoutes(app)
app.use(logError)
app.use(errorHandler)

const port = process.env.PORT || 8080

const run = async () => {
	const result = await mongoose.connect(MONGODB_URI, { useNewUrlParser: true })
	console.log(result)
	app.listen(port, () => {
		console.log(`Server on http://localhost:${port}`)
	})
}

run().catch(err => console.log(err))
