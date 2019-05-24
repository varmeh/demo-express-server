const { Product } = require('../models')

exports.getIndex = (_, res) => {
	Product.find()
		.then(products => {
			res.render('customer/home', {
				pageTitle: 'Home',
				products: products
			})
		})
		.catch(err => console.log(err))
}

exports.getProducts = (_, res) => {
	Product.find()
		.then(products => {
			res.render('customer/product-list', {
				pageTitle: 'Products',
				products: products
			})
		})
		.catch(err => console.log(err))
}

exports.getProductDetails = (req, res) => {
	Product.findById(req.params.productId)
		.then(product => {
			res.render('customer/product-detail', {
				pageTitle: product.title,
				product: product
			})
		})
		.catch(err => console.log(err))
}

exports.getCart = (req, res) => {
	// req.user
	// 	.getCartProducts()
	// 	.then(products => {
	// 		res.render('customer/cart', {
	// 			pageTitle: 'Cart',
	// 			products: products
	// 		})
	// 	})
	// 	.catch(err => console.log(err))
}

exports.addToCart = (req, res) => {
	// Product.findById(req.body.productId)
	// 	.then(product => req.user.addToCart(product))
	// 	.then(result => {
	// 		console.log(result)
	// 		res.redirect('/cart')
	// 	})
	// 	.catch(err => console.log(err))
}

exports.removeProductFromCart = (req, res) => {
	// req.user
	// 	.deleteFromCart(req.body.id)
	// 	.then(result => {
	// 		console.log(result)
	// 		res.redirect('/cart')
	// 	})
	// 	.catch(err => console.log(err))
}

exports.getOrders = (req, res) => {
	// req.user
	// 	.getOrders()
	// 	.then(orders => {
	// 		res.render('customer/order', {
	// 			pageTitle: 'Orders',
	// 			orders: orders
	// 		})
	// 	})
	// 	.catch(err => console.log(err))
}

exports.postOrder = (req, res) => {
	// req.user
	// 	.addOrder()
	// 	.then(() => res.redirect('/orders'))
	// 	.catch(err => console.log(err))
}
