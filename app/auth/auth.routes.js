const express = require('express')
const { body } = require('express-validator/check')

const router = express.Router()

const { User } = require('../models')

const {
	getLogin,
	postLogin,
	postLogout,
	getSignup,
	postSignup,
	getReset,
	postReset,
	getNewPassword,
	postNewPassword
} = require('./auth.controller')

router.get('/login', getLogin)

router.post(
	'/login',
	[
		body('email', 'Invalid email!!!')
			.isEmail()
			.normalizeEmail(),
		body('password', 'Invalid email or password!!!')
			.isLength({
				min: 6,
				max: 20
			})
			.trim()
	],
	postLogin
)

router.post('/logout', postLogout)

router.get('/signup', getSignup)

router.post(
	'/signup',
	[
		body('email')
			.isEmail()
			.withMessage('Please enter a valid email')
			.normalizeEmail(),
		body(
			'password',
			'Please enter a password with atleast 6 characters and with alphabets and numbers'
		)
			.isLength({ min: 6, max: 20 })
			.isAlphanumeric()
			.trim(),
		body('confirmPassword')
			.trim()
			.custom((value, { req }) => {
				if (value !== req.body.password) {
					throw new Error('Password & Confirm Password do not match!')
				}
				return true
			}),
		body('email').custom(async value => {
			const user = await User.findOne({ email: value })
			if (user) {
				return Promise.reject('User Already exists!!!')
			}
			return true
		})
	],
	postSignup
)

router.get('/reset', getReset)

router.post('/reset', postReset)

router.get('/reset/:resetToken', getNewPassword)

router.post('/password/new', postNewPassword)

module.exports = router
