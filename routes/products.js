const Product = require('../models/mProduct')

const express = require('express')

const router = express.Router()

router.get('/add', (_, res) => {
	res.render('add-product', { pageTitle: 'Add Product' })
})

router.post('/all', (req, res) => {
	new Product({ title: req.body.title }).save()
	res.redirect('/')
})

module.exports = router
