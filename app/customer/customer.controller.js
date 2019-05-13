const Product = require('../admin/product.model')
const Cart = require('../customer/cart.model')

exports.getIndex = (_, res) => {
	Product.fetchAll(products =>
		res.render('customer/home', {
			pageTitle: 'Home',
			products: products
		})
	)
}

exports.getProducts = (_, res) => {
	Product.fetchAll(products =>
		res.render('customer/product-list', {
			pageTitle: 'Products',
			products: products
		})
	)
}

exports.getProductDetails = (req, res) => {
	Product.findById(req.params.productId, product =>
		res.render('customer/product-detail', { pageTitle: product.title, product })
	)
}

exports.getCart = (_, res) => {
	res.render('customer/cart', {
		pageTitle: 'Cart'
	})
}

exports.addToCart = (req, res) => {
	Product.findById(req.body.productId, product => {
		Cart.addProduct(product)
	})
	res.render('customer/cart', { pageTitle: 'Cart' })
}

exports.getOrders = (_, res) => {
	res.render('customer/orders', {
		pageTitle: 'Orders'
	})
}

exports.getCheckout = (_, res) => {
	res.render('customer/checkout', {
		pageTitle: 'Checkout'
	})
}
