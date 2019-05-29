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

exports.getSignup = (_, res) => {
	res.render('auth/signup', {
		pageTitle: 'Signup',
		isAuthenticated: false
	})
}

exports.postSignup = (req, res) => {
	const { name, email, password, confirmPassword } = req.body
	User.findOne({ email })
		.then(user => {
			if (user || password != confirmPassword) {
				return res.redirect('/signup')
			}
			const newUser = new User({ name, email, password })
			return newUser.save()
		})
		.then(result => {
			console.log(result)
			res.redirect('/login')
		})
		.catch(err => console.log(err))
}
