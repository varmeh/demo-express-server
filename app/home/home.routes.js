const express = require('express')

const router = express.Router()

const { showProducts } = require('./home.controller')

router.get('/', showProducts)

module.exports = router
