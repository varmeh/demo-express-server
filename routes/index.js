const path = require('path')

const { rootDir } = require('../util')

const homeRoute = require('./home')
const productRoutes = require('./products')

/* Remember order matters when registering routes */
module.exports = app => {
	app.use(homeRoute)
	app.use('/product', productRoutes)

	// Setting up 404 message
	app.use((_, res) => {
		res.status(404).sendFile(path.join(rootDir, 'views', '404.html'))
	})
}
