const homeRoute = require('./customer/customer.routes')
const productRoutes = require('./admin/admin.routes')

/* Remember order matters when registering routes */
module.exports = app => {
	app.use('/admin', productRoutes)
	app.use(homeRoute)

	// Setting up 404 message
	app.use((_, res) => {
		res.status(404).render('customer/404', { pageTitle: 'Page Not Found' })
	})
}
