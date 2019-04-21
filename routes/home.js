const express = require('express')

const router = express.Router()

const { showProducts } = require('../controllers/products')

router.get('/', showProducts)

module.exports = router
