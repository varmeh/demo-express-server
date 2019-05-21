const express = require('express')

const router = express.Router()

const {
	getIndex,
	getProducts,
	getProductDetails,
	getCart,
	addToCart,
	getOrders,
	removeProductFromCart,
	postOrder
} = require('./customer.controller')

router.get('/', getIndex)

router.get('/products', getProducts)

router.get('/details/:productId', getProductDetails)

router.get('/cart', getCart)

router.post('/cart/add', addToCart)

router.post('/order/create', postOrder)

router.get('/orders', getOrders)

router.post('/cart/remove', removeProductFromCart)

module.exports = router
