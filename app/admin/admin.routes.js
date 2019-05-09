const express = require('express')

const router = express.Router()

const { newProduct, saveProduct } = require('./admin.controller')

router.get('/add-product', newProduct)

router.post('/all', saveProduct)

router.get('/products')

module.exports = router
