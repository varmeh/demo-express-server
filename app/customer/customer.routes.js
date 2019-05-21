const express = require('express')

const router = express.Router()

const {
	getIndex,
	getProducts,
	getProductDetails,
	getCart,
	addToCart,
	getCheckout,
	getOrders,
	removeProductFromCart
} = require('./customer.controller')

router.get('/', getIndex)

router.get('/products', getProducts)

router.get('/details/:productId', getProductDetails)

router.get('/cart', getCart)

router.post('/cart/add', addToCart)

router.get('/orders', getOrders)

router.get('/checkout', getCheckout)

router.post('/cart/remove', removeProductFromCart)

module.exports = router
