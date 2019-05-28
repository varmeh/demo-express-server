const { User } = require('../models')

exports.getLogin = (req, res) => {
	res.render('auth/login', {
		pageTitle: 'Login',
		isAuthenticated: req.session.user !== undefined
	})
}

exports.postLogin = (req, res) => {
	User.findById('5ce8d9598f7d0d3f6cf1b641')
		.then(user => {
			req.session.user = user
			res.redirect('/')
		})
		.catch(err => console.log(err))
}
