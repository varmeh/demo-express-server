const express = require('express')

const router = express.Router()

router.get('/', (_, res) => {
	res.render('home', {
		pageTitle: 'Home',
		prods: [
			{
				title: 'Time Flies',
				image: '',
				type: 'Books',
				price: '9.99$',
				description: 'A great book'
			}
		]
	})
})

module.exports = router
