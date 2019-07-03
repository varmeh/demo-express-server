const express = require('express')

const isAuth = require('../../middlewares/is-auth')
const router = express.Router()

const {
	getIndex,
	getProducts,
	getProductDetails,
	getCart,
	addToCart,
	getOrders,
	removeProductFromCart,
	postOrder,
	getInvoice
} = require('./customer.controller')

router.get('/', getIndex)

router.get('/products', getProducts)

router.get('/details/:productId', getProductDetails)

router.get('/cart', isAuth, getCart)

router.post('/cart/add', isAuth, addToCart)

router.post('/cart/remove', isAuth, removeProductFromCart)

router.post('/order/create', isAuth, postOrder)

router.get('/orders', isAuth, getOrders)

router.get('/orders/:orderId', isAuth, getInvoice)

module.exports = router
