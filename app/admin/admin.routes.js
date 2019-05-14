const express = require('express')

const router = express.Router()

const {
	newProduct,
	saveProduct,
	editProduct,
	updateProduct,
	deleteById,
	getProducts,
	removeProductFromCart
} = require('./admin.controller')

router.get('/product/new', newProduct)
router.post('/product/add', saveProduct)

router.get('/product/edit/:id', editProduct)
router.post('/product/update', updateProduct)

// Web forms don't support delete method
router.post('/product/delete', deleteById) // Caters to delete request from web forms
router.delete('/product/delete', deleteById) // Caters to AJAX delete request

router.get('/products', getProducts)

router.post('/cart/remove', removeProductFromCart)
module.exports = router
