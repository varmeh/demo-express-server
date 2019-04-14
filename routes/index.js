const path = require('path')

const { rootDir } = require('../util')

const homeRoute = require('./home')
const productRoutes = require('./products')

/* Remember order matters when registering routes */
module.exports = app => {
	app.use('/product', productRoutes)
	app.use(homeRoute)

	// Setting up 404 message
	app.use((_, res) => {
		res.status(404).render('404', { pageTitle: 'Page Not Found' })
	})
}
