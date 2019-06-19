const crypto = require('crypto')

const bcrypt = require('bcryptjs')
const nodeMailer = require('nodemailer')
const sendGridTransport = require('nodemailer-sendgrid-transport')
const { validationResult } = require('express-validator/check')

const { User } = require('../models')
const { Error500 } = require('../error.manager')

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

exports.postLogin = async (req, res, next) => {
	const { email, password } = req.body
	const errors = validationResult(req)

	if (!errors.isEmpty()) {
		return res.status(422).render('auth/login', {
			pageTitle: 'Login',
			errorMessage: errors.array()[0].msg
		})
	}

	try {
		// Search user on basis of email only
		const user = await User.findOne({ email })
		if (!user) {
			throw new Error()
		}

		// Compare Password
		const isMatch = await bcrypt.compare(password, user.password)
		if (isMatch) {
			req.session.user = user
			return req.session.save(() => {
				res.redirect('/')
			})
		}
		// Password mismatch
		throw new Error()
	} catch (err) {
		req.flash('error')
		res.status(401).redirect('/login')
	}
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

exports.postSignup = async (req, res, next) => {
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

	try {
		const hashedPassword = await bcrypt.hash(password, 12)
		await new User({ name, email, password: hashedPassword }).save()
		res.redirect('/login')
		return transporter.sendMail({
			to: email,
			from: 'shop@node-complete.com',
			subject: 'Congratulations: Your signup is successful!!!',
			html: '<h1>You successfully signed up!</h1>'
		})
	} catch (err) {
		next(new Error500(err.description))
	}
}

exports.getReset = (req, res) => {
	const messageArray = req.flash('error')
	res.render('auth/reset', {
		pageTitle: 'Reset Password',
		errorMessage: messageArray.length > 0 ? messageArray[0] : null
	})
}

exports.postReset = (req, res, next) => {
	crypto.randomBytes(32, async (err, buffer) => {
		if (err) {
			console.log(err)
			return res.redirect('/reset')
		}

		const token = buffer.toString('hex')
		try {
			const user = await User.findOne({ email: req.body.email })
			if (!user) {
				req.flash('error', 'No account with that email found')
				return res.redirect('/reset')
			}

			// Add token & expiry date to user data
			user.resetToken = token
			user.resetTokenExpiration = Date.now() + 1 * 3600 * 1000 // 1 hr in ms
			await user.save()

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
		} catch (err) {
			next(new Error500(err.description))
		}
	})
}

exports.getNewPassword = async (req, res, next) => {
	const { resetToken } = req.params

	try {
		const user = await User.findOne({
			resetToken,
			resetTokenExpiration: { $gt: Date.now() }
		})
		const messageArray = req.flash('error')
		res.render('auth/new-password', {
			pageTitle: 'New Password',
			errorMessage: messageArray.length > 0 ? messageArray[0] : null,
			userId: user._id.toString(),
			passwordToken: resetToken
		})
	} catch (err) {
		next(new Error500(err.description))
	}
}

exports.postNewPassword = async (req, res, next) => {
	const { newPassword, userId, passwordToken } = req.body
	let resetUser = null

	try {
		const user = await User.findOne({ resetToken: passwordToken, _id: userId })
		const hashedPassword = await bcrypt.hash(newPassword, 12)

		user.password = hashedPassword
		user.resetToken = null
		user.resetTokenExpiration = undefined
		await user.save()

		res.redirect('/login')
		transporter.sendMail({
			to: user.email,
			from: 'shop@node-complete.com',
			subject: 'Your reset is successful',
			html: '<h1>You password reset is successful</h1>'
		})
	} catch (err) {
		next(new Error500(err.description))
	}
}
