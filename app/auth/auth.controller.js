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
			req.session.save(err => {
				console.log(err)
				res.redirect('/')
			})
		})
		.catch(err => console.log(err))
}

exports.postLogout = (req, res) => {
	req.session.destroy(() => res.redirect('/'))
}
