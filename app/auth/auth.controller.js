const crypto = require('crypto')

const bcrypt = require('bcryptjs')
const nodeMailer = require('nodemailer')
const sendGridTransport = require('nodemailer-sendgrid-transport')
const { validationResult } = require('express-validator/check')

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
	const errors = validationResult(req)

	if (!errors.isEmpty()) {
		return res.status(422).render('auth/login', {
			pageTitle: 'Login',
			errorMessage: errors.array()[0].msg
		})
	}

	User.findOne({ email })
		.then(user => {
			// Search based on user email only
			if (!user) {
				req.flash('error', 'Invalid user!!!')
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
		errorMessage: messageArray.length > 0 ? messageArray[0] : null,
		initialValue: {
			name: '',
			email: ''
		}
	})
}

exports.postSignup = (req, res) => {
	const { name, email, password } = req.body
	const errors = validationResult(req)

	if (!errors.isEmpty()) {
		return res.status(422).render('auth/signup', {
			pageTitle: 'Signup',
			errorMessage: errors.array()[0].msg,
			initialValue: {
				name,
				email
			}
		})
	}

	bcrypt
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
		.catch(err => console.log(err))
}

exports.getReset = (req, res) => {
	const messageArray = req.flash('error')
	res.render('auth/reset', {
		pageTitle: 'Reset Password',
		errorMessage: messageArray.length > 0 ? messageArray[0] : null
	})
}

exports.postReset = (req, res) => {
	crypto.randomBytes(32, (err, buffer) => {
		if (err) {
			console.log(err)
			return res.redirect('/reset')
		}

		const token = buffer.toString('hex')
		User.findOne({ email: req.body.email })
			.then(user => {
				if (!user) {
					req.flash('error', 'No account with that email found')
					return res.redirect('/reset')
				}
				user.resetToken = token
				user.resetTokenExpiration = Date.now() + 1 * 3600 * 1000 // 1 hr in ms
				return user.save()
			})
			.then(() => {
				res.redirect('/')
				return transporter.sendMail({
					to: req.body.email,
					from: 'shop@node-complete.com',
					subject: 'Password Reset!!!',
					html: `
						<p>You requested a password reset</p>
						<p>Click this <a href="http://localhost:8080/reset/${token}">link</a> to set a new password</p>
					`
				})
			})
			.catch(err => console.log(err))
	})
}

exports.getNewPassword = (req, res) => {
	const { resetToken } = req.params
	User.findOne({
		resetToken: req.params.resetToken,
		resetTokenExpiration: { $gt: Date.now() }
	})
		.then(user => {
			const messageArray = req.flash('error')
			res.render('auth/new-password', {
				pageTitle: 'New Password',
				errorMessage: messageArray.length > 0 ? messageArray[0] : null,
				userId: user._id.toString(),
				passwordToken: resetToken
			})
		})
		.catch(err => console.log(err))
}

exports.postNewPassword = (req, res) => {
	const { newPassword, userId, passwordToken } = req.body
	let resetUser = null
	User.findOne({ resetToken: passwordToken, _id: userId })
		.then(user => {
			resetUser = user
			return bcrypt.hash(newPassword, 12)
		})
		.then(hashedPassword => {
			resetUser.password = hashedPassword
			resetUser.resetToken = null
			resetUser.resetTokenExpiration = undefined
			return resetUser.save()
		})
		.then(result => {
			console.log(result)
			res.redirect('/login')
			transporter.sendMail({
				to: resetUser.email,
				from: 'shop@node-complete.com',
				subject: 'Your reset is successful',
				html: '<h1>You password reset is successful</h1>'
			})
		})
		.catch(err => console.log(err))
}
