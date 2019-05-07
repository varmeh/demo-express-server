const homeRoute = require('./home/home.routes')
const productRoutes = require('./products/products.routes')

/* Remember order matters when registering routes */
module.exports = app => {
	app.use('/product', productRoutes)
	app.use(homeRoute)

	// Setting up 404 message
	app.use((_, res) => {
		res.status(404).render('404', { pageTitle: 'Page Not Found' })
	})
}
