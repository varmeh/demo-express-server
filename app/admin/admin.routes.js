const express = require('express')

const router = express.Router()

const {
	newProduct,
	saveProduct,
	getProducts,
	editProduct,
	updateProduct
} = require('./admin.controller')

router.get('/product/new', newProduct)
router.post('/product/add', saveProduct)

router.get('/product/edit/:id', editProduct)
router.post('/product/update', updateProduct)

router.get('/products', getProducts)

module.exports = router
