const Product = require('../admin/product.model')

exports.showProducts = (_, res) => {
	Product.fetchAll(products =>
		res.render('customer/product-list', {
			pageTitle: 'Home',
			products: products
		})
	)
}
