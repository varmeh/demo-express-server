const Product = require('../models/mProduct')

new Product({
	title: 'First Book',
	price: '11.99',
	description: 'A good book'
}).save()

new Product({
	title: 'Second Book',
	price: '12.99',
	description: 'A better book'
}).save()

exports.showProducts = (_, res) => {
	res.render('home', {
		pageTitle: 'Home',
		products: Product.fetchAll()
	})
}
