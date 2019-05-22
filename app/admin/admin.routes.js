const express = require('express')

const router = express.Router()

const {
	newProduct,
	postNewProduct,
	editProduct,
	postUpdateProduct,
	deleteById,
	getProducts
} = require('./admin.controller')

router.get('/product/new', newProduct)
router.post('/product/add', postNewProduct)

router.get('/product/edit/:id', editProduct)
router.post('/product/update', postUpdateProduct)

// Web forms don't support delete method
router.post('/product/delete', deleteById) // Caters to delete request from web forms
router.delete('/product/delete', deleteById) // Caters to AJAX delete request

router.get('/products', getProducts)

module.exports = router
