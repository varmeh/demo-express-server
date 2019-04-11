/* global __dirname */
const path = require('path')

const homeRoute = require('./home')
const productRoutes = require('./products')

/* Remember order matters when registering routes */
module.exports = app => {
	app.use(homeRoute)
	app.use('/product', productRoutes)

	// Setting up 404 message
	app.use((_, res) => {
		res.sendFile(path.join(__dirname, '../', 'views', '404.html'))
	})
}
