const { Product } = require('../models')

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

exports.getCart = (req, res) => {
	req.user
		.getCart()
		.then(cart => cart.getProducts())
		.then(products => {
			res.render('customer/cart', {
				pageTitle: 'Cart',
				products: products
			})
		})
		.catch(err => console.log(err))
}

exports.addToCart = (req, res) => {
	let fetchedCart
	let newQuantity = 1
	req.user
		.getCart()
		.then(cart => {
			fetchedCart = cart
			return cart.getProducts({
				where: {
					id: req.body.productId
				}
			})
		})
		.then(products => {
			if (products.length === 1) {
				// Product already in Cart. Update quantity
				newQuantity = products[0].cartItem.quantity + 1
				return products[0]
			}
			// find product
			return Product.findByPk(req.body.productId)
		})
		.then(product => {
			return fetchedCart.addProduct(product, {
				through: { quantity: newQuantity }
			})
		})
		.then(() => res.redirect('/cart'))
		.catch(err => console.log(err))
}

exports.removeProductFromCart = (req, res) => {
	req.user
		.getCart()
		.then(cart => cart.getProducts({ where: { id: req.body.id } }))
		.then(products => products[0].cartItem.destroy())
		.then(result => {
			console.log(result)
			res.redirect('/cart')
		})
		.catch(err => console.log(err))
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
