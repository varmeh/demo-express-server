const express = require('express')

const router = express.Router()

router.get('/add', (_, res) => {
	res.send(
		'<form action="/product/all" method="POST"><input type="text" name="title"><button type="submit">Add Product</button></form>'
	)
})

router.post('/all', (req, res) => {
	console.log('Req body: ', req.body)
	res.redirect('/')
})

module.exports = router
