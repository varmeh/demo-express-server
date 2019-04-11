const home = require('./home')
const product = require('./products')

/* Remember order matters when registering routes */
const pageNotFoundTemplate = () => '<h2>404 - Page Not Found</h2>'

module.exports = app => {
	app.use(home)
	app.use(product)

	app.use((_, res, next) => {
		res.status(404).send(pageNotFoundTemplate())
		next()
	})
}
