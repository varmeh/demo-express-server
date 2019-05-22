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
			.then(result => console.log(result))
			.catch(err => console.log(err))
	}

	static fetchAll() {
		return getdb()
			.collection('products')
			.find()
			.toArray()
			.then(products => {
				console.log(products)
				return products
			})
			.catch(err => console.log(err))
	}
}

module.exports = Product
