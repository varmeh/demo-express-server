const mongodb = require('mongodb')

/**
 * @param {function} callback - Success callback
 * @param {function} error - error callback
 */

let _db

exports.mongoConnect = (callback, error) => {
	mongodb.MongoClient.connect(
		'mongodb+srv://service-account:lrO2JByKvwH6W9am@cluster0-free-mumbai-hsmgc.mongodb.net/shop?retryWrites=true',
		{ useNewUrlParser: true }
	)
		.then(client => {
			console.log('db connection: SUCCESS :', client)
			_db = client.db()
			callback()
		})
		.catch(err => {
			console.log('db connection: FAILED : ', err)
			error(err)
		})
}

exports.getdb = () => {
	if (_db) {
		return _db
	}
	throw 'No database found'
}
