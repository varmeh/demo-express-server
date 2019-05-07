const express = require('express')

const router = express.Router()

const { showProducts } = require('../products/products.controller')

router.get('/', showProducts)

module.exports = router
