const mongodb = require('mongodb')
const { getdb } = require('../util/database')

const collectionName = 'user'
class User {
	constructor({ username, email }) {
		this.username = username
		this.email = email
	}

	save() {
		return getdb()
			.collection(collectionName)
			.insertOne(this)
	}

	static findById(userId) {
		return getdb()
			.collection(collectionName)
			.find({ _id: new mongodb.ObjectID(userId) })
			.next()
	}
}

module.exports = User
