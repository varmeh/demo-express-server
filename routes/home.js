const express = require('express')

const router = express.Router()

router.get('/', (_, res) => {
	res.render('home', {
		pageTitle: 'Home'
	})
})

module.exports = router
