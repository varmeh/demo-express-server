const express = require('express')

const router = express.Router()

const { newProduct, saveProduct, getProducts } = require('./admin.controller')

router.get('/product/add', newProduct)

router.post('/all', saveProduct)

router.get('/products', getProducts)

module.exports = router
