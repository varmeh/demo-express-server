const Product = require('../models/product')
const Cart = require('../models/cart')

exports.getIndex = (_, res) => {
	Product.findAll()
		.then(products => {
			res.render('customer/home', {
				pageTitle: 'Home',
				products: products
			})
		})
		.catch(err => console.log(err))
}

exports.getProducts = (_, res) => {
	Product.findAll()
		.then(products => {
			res.render('customer/product-list', {
				pageTitle: 'Products',
				products: products
			})
		})
		.catch(err => console.log(err))
}

exports.getProductDetails = (req, res) => {
	Product.findByPk(req.params.productId)
		.then(product => {
			res.render('customer/product-detail', {
				pageTitle: product.title,
				product: product
			})
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
