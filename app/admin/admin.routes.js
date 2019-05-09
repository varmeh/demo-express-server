const Product = require('./product.model')

const express = require('express')

const router = express.Router()

router.get('/add-product', (_, res) => {
	res.render('admin/add-product', { pageTitle: 'Add Product' })
})

router.post('/all', (req, res) => {
	new Product({ title: req.body.title }).save()
	res.redirect('/')
})

module.exports = router
