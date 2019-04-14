const express = require('express')

const router = express.Router()

router.get('/add', (_, res) => {
	res.render('add-product', { pageTitle: 'Add Product' })
})

router.post('/all', (req, res) => {
	console.log('Req body: ', req.body)
	res.redirect('/')
})

module.exports = router
