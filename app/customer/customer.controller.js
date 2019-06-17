const { Product, Order } = require('../models')
const { Error500 } = require('../error.manager')

exports.getIndex = (req, res, next) => {
	Product.find()
		.then(products => {
			res.render('customer/home', {
				pageTitle: 'Home',
				products: products
			})
		})
		.catch(err => next(new Error500(err.description)))
}

exports.getProducts = (req, res, next) => {
	Product.find()
		.then(products => {
			res.render('customer/product-list', {
				pageTitle: 'Products',
				products: products
			})
		})
		.catch(err => next(new Error500(err.description)))
}

exports.getProductDetails = (req, res, next) => {
	Product.findById(req.params.productId)
		.then(product => {
			res.render('customer/product-detail', {
				pageTitle: product.title,
				product: product
			})
		})
		.catch(err => next(new Error500(err.description)))
}

exports.getCart = (req, res, next) => {
	req.user
		.populate('cart.items.productId')
		.execPopulate()
		.then(user => {
			res.render('customer/cart', {
				pageTitle: 'Cart',
				products: user.cart.items
			})
		})
		.catch(err => next(new Error500(err.description)))
}

exports.addToCart = (req, res, next) => {
	Product.findById(req.body.productId)
		.then(product => req.user.addToCart(product))
		.then(result => {
			console.log(result)
			res.redirect('/cart')
		})
		.catch(err => next(new Error500(err.description)))
}

exports.removeProductFromCart = (req, res, next) => {
	req.user
		.removeFromCart(req.body.id)
		.then(result => {
			console.log(result)
			res.redirect('/cart')
		})
		.catch(err => next(new Error500(err.description)))
}

exports.getOrders = (req, res, next) => {
	Order.find({ 'user._id': req.user._id })
		.then(orders => {
			res.render('customer/order', {
				pageTitle: 'Orders',
				orders: orders
			})
		})
		.catch(err => next(new Error500(err.description)))
}

exports.postOrder = (req, res, next) => {
	req.user
		.populate('cart.items.productId')
		.execPopulate()
		.then(user => {
			const products = user.cart.items.map(i => {
				const { _id, title, price, description, imageUrl } = i.productId
				return {
					productData: { _id, title, price, description, imageUrl },
					quantity: i.quantity
				}
			})
			const { _id, name, email } = req.user
			const order = new Order({ user: { _id, name, email }, products })
			return order.save()
		})
		.then(result => {
			console.log(result)
			req.user.clearCart()
		})
		.then(() => res.redirect('/orders'))
		.catch(err => next(new Error500(err.description)))
}
