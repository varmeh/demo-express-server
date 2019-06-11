const bcrypt = require('bcryptjs')
const nodeMailer = require('nodemailer')
const sendGridTransport = require('nodemailer-sendgrid-transport')

const { User } = require('../models')

const transporter = nodeMailer.createTransport(
	sendGridTransport({
		auth: {
			api_key: process.env.SEND_GRID_API
		}
	})
)

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
					req.flash('error', 'Invalid email or password.')
					res.redirect('/login')
				})
		})
		.catch(err => console.log(err))
}

exports.postLogout = (req, res) => {
	req.session.destroy(() => res.redirect('/'))
}

exports.getSignup = (req, res) => {
	const messageArray = req.flash('error')
	res.render('auth/signup', {
		pageTitle: 'Signup',
		errorMessage: messageArray.length > 0 ? messageArray[0] : null
	})
}

exports.postSignup = (req, res) => {
	const { name, email, password } = req.body
	User.findOne({ email })
		.then(user => {
			if (user) {
				req.flash('error', 'User Already exists!!!')
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
					return transporter.sendMail({
						to: email,
						from: 'shop@node-complete.com',
						subject: 'Congratulations: Your signup is successful!!!',
						html: '<h1>You successfully signed up!</h1>'
					})
				})
		})
		.catch(err => console.log(err))
}

exports.getReset = (req, res) => {
	const messageArray = req.flash('error')
	res.render('auth/reset', {
		pageTitle: 'Reset Password',
		errorMessage: messageArray.length > 0 ? messageArray[0] : null
	})
}