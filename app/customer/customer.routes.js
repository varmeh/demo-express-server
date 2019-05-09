const express = require('express')

const router = express.Router()

const { showProducts } = require('./customer.controller')

router.get('/', showProducts)

router.get('/products')

router.get('/cart')

router.get('/checkout')

module.exports = router
