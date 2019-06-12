const express = require('express')
const { body } = require('express-validator/check')

const router = express.Router()

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

router.post('/login', postLogin)

router.post('/logout', postLogout)

router.get('/signup', getSignup)

router.post(
	'/signup',
	[
		body('email')
			.isEmail()
			.withMessage('Please enter a valid email'),
		body(
			'password',
			'Please enter a password with atleast 6 characters and with alphabets and numbers'
		)
			.isLength({ min: 6, max: 20 })
			.isAlphanumeric(),
		body('confirmPassword').custom((value, { req }) => {
			if (value !== req.body.password) {
				throw new Error('Password & Confirm Password do not match!')
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
