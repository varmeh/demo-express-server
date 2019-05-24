const mongodb = require('mongodb')
const { getdb } = require('../util/database')

const collections = require('./collections')
class Product {
	constructor({
		title = '',
		price = 9,
		description = 'A book',
		image = '',
		id = null,
		userId = ''
	}) {
		this.title = title
		this.price = price
		this.description = description
		this.image = image
		this._id = id ? new mongodb.ObjectID(id) : null
		this.userId = userId
	}

	save() {
		const db = getdb()
		if (this._id) {
			// Update product
			return db
				.collection(collections.products)
				.updateOne({ _id: this._id }, { $set: this })
		}
		// Save Product
		return db.collection(collections.products).insertOne(this)
	}

	static fetchAll() {
		return getdb()
			.collection(collections.products)
			.find()
			.toArray()
	}

	static findById(id) {
		return getdb()
			.collection(collections.products)
			.find({ _id: mongodb.ObjectID(id) })
			.next()
	}

	static deleteById(id) {
		return getdb()
			.collection(collections.products)
			.deleteOne({ _id: new mongodb.ObjectId(id) })
	}
}

module.exports = Product
