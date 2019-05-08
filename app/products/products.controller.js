const Product = require('./product.model')

exports.showProducts = (_, res) => {
	Product.fetchAll(products =>
		res.render('home', {
			pageTitle: 'Home',
			products: products
		})
	)
}
