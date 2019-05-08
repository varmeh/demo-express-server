const Product = require('../products/product.model')

exports.showProducts = (_, res) => {
	Product.fetchAll(products =>
		res.render('shop/product-list', {
			pageTitle: 'Home',
			products: products
		})
	)
}
