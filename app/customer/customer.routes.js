const express = require('express')

const router = express.Router()

const {
	getIndex,
	getProducts,
	getCart,
	getCheckout,
	getOrders
} = require('./customer.controller')

router.get('/', getIndex)

router.get('/products', getProducts)

router.get('/cart', getCart)

router.get('/orders', getOrders)

router.get('/checkout', getCheckout)

module.exports = router
