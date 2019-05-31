const bcrypt = require('bcryptjs')

const { User } = require('../models')

exports.getLogin = (req, res) => {
	const messageArray = req.flash('error')
	res.render('auth/login', {
		pageTitle: 'Login',
		errorMessage: messageArray.length > 0 ? messageArray[0] : null
	})
}

exports.postLogin = (req, res) => {
	const { email, password } = req.body
	User.findOne({ email })
		.then(user => {
			if (!user) {
				req.flash('error', 'Invalid email or password.')
				return res.redirect('/login')
			}
			bcrypt
				.compare(password, user.password)
				.then(doPasswordMatch => {
					if (doPasswordMatch) {
						req.session.user = user
						return req.session.save(() => {
							res.redirect('/')
						})
					}
					res.redirect('/login')
				})
				.catch(err => {
					console.log(err)
					res.redirect('/login')
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

			// Nested chain to avoid calling following then in case of redirect to signup.
			return bcrypt
				.hash(password, 12)
				.then(hashedPassword => {
					const newUser = new User({ name, email, password: hashedPassword })
					return newUser.save()
				})
				.then(result => {
					console.log(result)
					res.redirect('/login')
				})
		})
		.catch(err => console.log(err))
}
