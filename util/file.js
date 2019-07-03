const fs = require('fs')
const { Error500 } = require('../app/error.manager')

exports.deleteFile = filepath => {
	fs.unlink(filepath, err => {
		if (err) {
			throw new Error500(err.description, 'Server Error')
		}
	})
}
