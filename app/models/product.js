const mongodb = require('mongodb')
const { getdb } = require('../util/database')

class Product {
	constructor({ title, price = 9, description = 'A book', image = '' }) {
		this.title = title
		this.price = price
		this.description = description
		this.image = image
	}

	save() {
		return getdb()
			.collection('products')
			.insertOne(this)
			.then(result => console.log('save result: ', result))
			.catch(err => console.log(err))
	}

	static fetchAll() {
		return getdb()
			.collection('products')
			.find()
			.toArray()
			.then(products => {
				console.log('all products: ', products)
				return products
			})
			.catch(err => console.log(err))
	}

	static findById(id) {
		return getdb()
			.collection('products')
			.find({ _id: mongodb.ObjectID(id) })
			.next()
			.then(product => {
				console.log(`Product with ${id}: `, product)
				return product
			})
			.catch(err => console.log(err))
	}
}

module.exports = Product
