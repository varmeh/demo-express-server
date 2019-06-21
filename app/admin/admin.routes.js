const express = require('express')
const { body } = require('express-validator/check')
const router = express.Router()

const {
	newProduct,
	postNewProduct,
	editProduct,
	postEditProduct,
	deleteById,
	getProducts
} = require('./admin.controller')

const postProductValidators = [
	body('title')
		.isString()
		.isLength({ min: 3 })
		.trim(),
	// body('image').isEmpty(),
	body('price').isFloat(),
	body('description')
		.isLength({ min: 5, max: 255 })
		.trim()
]

router.get('/product/new', newProduct)
router.post('/product/add', postProductValidators, postNewProduct)

router.get('/product/edit/:id', editProduct)
router.post('/product/update', postProductValidators, postEditProduct)

// Web forms only support GET & POST request
router.post('/product/delete', deleteById) // Caters to delete request from web forms
router.delete('/product/delete', deleteById) // Caters to AJAX delete request

router.get('/products', getProducts)

module.exports = router
