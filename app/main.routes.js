const customerRoutes = require('./customer/customer.routes')
const adminRoutes = require('./admin/admin.routes')
const authRoutes = require('./auth/auth.routes')

/* Remember order matters when registering routes */
module.exports = app => {
	// Add admin routes have base url - /admin/*
	app.use('/admin', adminRoutes)
	app.use(customerRoutes)
	app.use(authRoutes)

	// Setting up 404 message
	app.use((_, res) => {
		res.status(404).render('customer/error-info', {
			pageTitle: 'Page Not Found',
			message: 'Page Not Found'
		})
	})
}
