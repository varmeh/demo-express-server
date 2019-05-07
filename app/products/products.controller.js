const Product = require('./product.model')

exports.showProducts = (_, res) => {
	res.render('home', {
		pageTitle: 'Home',
		products: Product.fetchAll()
	})
}
