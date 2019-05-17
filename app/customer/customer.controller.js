const Product = require('../models/product')
const Cart = require('../models/cart')

exports.getIndex = (_, res) => {
	Product.findAll()
		.then(rows => {
			res.render('customer/home', {
				pageTitle: 'Home',
				products: rows
			})
		})
		.catch(err => console.log(err))
}

exports.getProducts = (_, res) => {
	Product.findAll()
		.then(rows => {
			res.render('customer/product-list', {
				pageTitle: 'Products',
				products: rows
			})
		})
		.catch(err => console.log(err))
}

exports.getProductDetails = (req, res) => {
	Product.findById(req.params.productId)
		.then(([rows]) => {
			if (rows.length === 1) {
				res.render('customer/product-detail', {
					pageTitle: rows[0].title,
					product: rows[0]
				})
			}
		})
		.catch(err => console.log(err))
}

exports.getCart = (_, res) => {
	Cart.getCart(cart => {
		res.render('customer/cart', {
			pageTitle: 'Cart',
			totalPrice: cart.totalPrice,
			products: cart.products,
			quantity: cart.quantity
		})
	})
}

exports.addToCart = (req, res) => {
	Product.findById(req.body.productId, product => {
		Cart.addProduct(product)
	})
	res.redirect('/')
}

exports.getOrders = (_, res) => {
	res.render('customer/error-info', {
		pageTitle: 'Orders',
		message: 'No order found'
	})
}

exports.getCheckout = (_, res) => {
	res.render('customer/checkout', {
		pageTitle: 'Checkout'
	})
}
