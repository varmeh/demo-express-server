const express = require('express')

const router = express.Router()

const { showProducts } = require('../controllers/cProducts')

router.get('/', showProducts)

module.exports = router
