/* eslint-disable indent */
exports.logError = (error, _req, _res, next) => {
	console.log('Logger: ', error.stack)
	next(error)
}

// eslint-disable-next-line no-unused-vars
exports.errorHandler = (error, _req, res, _next) => {
	const { statusCode, message, pageTitle } = error

	res.status(statusCode).render('customer/error-info', {
		pageTitle,
		message
	})
}

exports.ErrorCustom = class extends Error {
	constructor(message = '', title = '', statusCode = 400) {
		super(message)
		// Ensure the name of this error is the same as the class name
		this.name = this.constructor.name
		// Copy stack trace to new error
		Error.captureStackTrace(this, this.constructor)

		this.statusCode = statusCode
		this.pageTitle = title
	}
}

exports.Error500 = class extends this.ErrorCustom {
	constructor(message, title = 'Server Down') {
		super(message, title, 500)
	}
}

exports.Error404 = class extends this.ErrorCustom {
	constructor(message, title = 'Page Not Found') {
		super(message, title, 404)
	}
}
