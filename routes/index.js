const home = require('./home')
const product = require('./products')

/* Remember order matters when registering routes */
module.exports = app => {
	app.use(home)
	app.use(product)
}
