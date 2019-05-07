const Product = require('../models/mProduct')

exports.showProducts = (_, res) => {
	res.render('home', {
		pageTitle: 'Home',
		products: Product.fetchAll()
	})
}
