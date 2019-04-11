const home = require('./home')
const product = require('./products')

module.exports = app => {
	app.use(home)
	app.use(product)
}
