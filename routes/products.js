/* global __dirname */
const express = require('express')
const path = require('path')

const router = express.Router()

router.get('/add', (_, res) => {
	res.sendFile(path.join(__dirname, '../', 'views', 'add-product.html'))
})

router.post('/all', (req, res) => {
	console.log('Req body: ', req.body)
	res.redirect('/')
})

module.exports = router
