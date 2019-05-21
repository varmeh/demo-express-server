/* global process, __dirname */
const express = require('express')
const morgan = require('morgan')
const fs = require('fs')
const path = require('path')
const bodyParser = require('body-parser')

const configureRoutes = require('./main.routes')
const app = express()

const sequelize = require('./util/database')
const { Product, User, Cart, CartItem } = require('./models')

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

/* Configure request body parser on different routes */
app.use('/admin', bodyParser.urlencoded({ extended: false }))
app.post('/cart/*', bodyParser.urlencoded({ extended: false }))

/* Middleware to get default User Id */
app.use((req, _, next) => {
	User.findByPk(1)
		.then(user => {
			req.user = user
			next()
		})
		.catch(err => console.log(err))
})

/* Opening api access to public folder */
app.use(express.static(path.join(__dirname, '..', 'public')))

/* Setting up ejs template engine */
app.set('view engine', 'ejs')
app.set('views', 'app/views')

/* Add routes */
configureRoutes(app)

/* Establish Sequelize models associations */
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' })
User.hasMany(Product)
User.hasOne(Cart)
Cart.belongsToMany(Product, { through: CartItem })
Product.belongsToMany(Cart, { through: CartItem })

/* Sync all your sequelize models with database */
sequelize
	.sync()
	.then(() => {
		const port = process.env.PORT || 8080
		app.listen(port, () => {
			console.log(`Server on http://localhost:${port}`)
		})
	})
	.catch(err => console.log(err))
