const { Product, Order } = require('../models')

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
	req.user
		.populate('cart.items.productId')
		.execPopulate()
		.then(user => {
			res.render('customer/cart', {
				pageTitle: 'Cart',
				products: user.cart.items
			})
		})
		.catch(err => console.log(err))
}

exports.addToCart = (req, res) => {
	Product.findById(req.body.productId)
		.then(product => req.user.addToCart(product))
		.then(result => {
			console.log(result)
			res.redirect('/cart')
		})
		.catch(err => console.log(err))
}

exports.removeProductFromCart = (req, res) => {
	req.user
		.removeFromCart(req.body.id)
		.then(result => {
			console.log(result)
			res.redirect('/cart')
		})
		.catch(err => console.log(err))
}

exports.getOrders = (req, res) => {
	Order.find({ 'user._id': req.user._id })
		.then(orders => {
			res.render('customer/order', {
				pageTitle: 'Orders',
				orders: orders
			})
		})
		.catch(err => console.log(err))
}

exports.postOrder = (req, res) => {
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
		.catch(err => console.log(err))
}
