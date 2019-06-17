const customerRoutes = require('./customer/customer.routes')
const adminRoutes = require('./admin/admin.routes')
const authRoutes = require('./auth/auth.routes')

const isAuth = require('../middlewares/is-auth')
const { Error404 } = require('./error.manager')

/* Remember order matters when registering routes */
module.exports = app => {
	// Add admin routes have base url - /admin/*
	app.use('/admin', isAuth, adminRoutes)
	app.use(customerRoutes)
	app.use(authRoutes)

	// Setting up 404 message
	app.use(() => {
		throw new Error404('Page not found')
	})
}
