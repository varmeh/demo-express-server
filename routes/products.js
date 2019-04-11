const express = require('express')
const path = require('path')

const { rootDir } = require('../util')
const router = express.Router()

router.get('/add', (_, res) => {
	res.sendFile(path.join(rootDir, 'views', 'add-product.html'))
})

router.post('/all', (req, res) => {
	console.log('Req body: ', req.body)
	res.redirect('/')
})

module.exports = router
