const { Product } = require('../models')

exports.getIndex = (_, res) => {
	Product.fetchAll()
		.then(products => {
			res.render('customer/home', {
				pageTitle: 'Home',
				products: products
			})
		})
		.catch(() => {})
}

exports.getProducts = (_, res) => {
	Product.fetchAll()
		.then(products => {
			res.render('customer/product-list', {
				pageTitle: 'Products',
				products: products
			})
		})
		.catch(() => {})
}

exports.getProductDetails = (req, res) => {
	// Product.findByPk(req.params.productId)
	// 	.then(product => {
	// 		res.render('customer/product-detail', {
	// 			pageTitle: product.title,
	// 			product: product
	// 		})
	// 	})
	// 	.catch(err => console.log(err))
}

exports.getCart = (req, res) => {
	// req.user
	// 	.getCart()
	// 	.then(cart => cart.getProducts())
	// 	.then(products => {
	// 		res.render('customer/cart', {
	// 			pageTitle: 'Cart',
	// 			products: products
	// 		})
	// 	})
	// 	.catch(err => console.log(err))
}

exports.addToCart = (req, res) => {
	// let fetchedCart
	// let newQuantity = 1
	// req.user
	// 	.getCart()
	// 	.then(cart => {
	// 		fetchedCart = cart
	// 		return cart.getProducts({
	// 			where: {
	// 				id: req.body.productId
	// 			}
	// 		})
	// 	})
	// 	.then(products => {
	// 		if (products.length === 1) {
	// 			// Product already in Cart. Update quantity
	// 			newQuantity = products[0].cartItem.quantity + 1
	// 			return products[0]
	// 		}
	// 		// find product
	// 		return Product.findByPk(req.body.productId)
	// 	})
	// 	.then(product => {
	// 		return fetchedCart.addProduct(product, {
	// 			through: { quantity: newQuantity }
	// 		})
	// 	})
	// 	.then(() => res.redirect('/cart'))
	// 	.catch(err => console.log(err))
}

exports.removeProductFromCart = (req, res) => {
	// req.user
	// 	.getCart()
	// 	.then(cart => cart.getProducts({ where: { id: req.body.id } }))
	// 	.then(products => products[0].cartItem.destroy())
	// 	.then(result => {
	// 		console.log(result)
	// 		res.redirect('/cart')
	// 	})
	// 	.catch(err => console.log(err))
}

exports.getOrders = (req, res) => {
	// req.user
	// 	.getOrders({ include: 'products', order: [['id', 'DESC']] })
	// 	.then(orders => {
	// 		res.render('customer/order', {
	// 			pageTitle: 'Orders',
	// 			orders: orders
	// 		})
	// 	})
	// 	.catch(err => console.log(err))
}

exports.postOrder = (req, res) => {
	// let fetchedCart, cartProducts
	// req.user
	// 	.getCart()
	// 	.then(cart => {
	// 		fetchedCart = cart
	// 		return cart.getProducts()
	// 	})
	// 	.then(products => {
	// 		cartProducts = products
	// 		return req.user.createOrder()
	// 	})
	// 	.then(order =>
	// 		order.addProducts(
	// 			cartProducts.map(product => {
	// 				product.orderItem = { quantity: product.cartItem.quantity }
	// 				return product
	// 			})
	// 		)
	// 	)
	// 	.then(() => fetchedCart.setProducts(null))
	// 	.then(() => res.redirect('/orders'))
	// 	.catch(err => console.log(err))
}
