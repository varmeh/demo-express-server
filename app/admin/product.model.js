/* eslint-disable no-undef */
const fs = require('fs')
const path = require('path')

var uniqid = require('uniqid')

const file = path.join(
	path.dirname(process.mainModule.filename),
	'..',
	'products.json'
)

const getProductsFromFile = cb => {
	fs.readFile(file, (err, fileContent) => {
		cb(err ? [] : JSON.parse(fileContent))
	})
}

module.exports = class Product {
	constructor({
		id = null,
		title = '',
		image = '',
		description = 'A Book',
		type = 'Books',
		price = '9.99$'
	}) {
		this.id = id
		this.title = title
		this.image = image
		this.type = type
		this.price = price
		this.description = description
	}

	writeToFile(products) {
		fs.writeFile(file, JSON.stringify(products), err => {
			if (err) {
				console.error(`Write Failed: Product File: ${err.description}`)
			}
		})
	}

	save() {
		if (this.id === null) {
			this.id = uniqid()
		}
		getProductsFromFile(products => {
			products.push(this)
			this.writeToFile(products)
		})
	}

	update() {
		getProductsFromFile(products => {
			const productIndex = products.findIndex(product => product.id === this.id)
			const updatedProducts = [...products]
			updatedProducts[productIndex] = this

			this.writeToFile(updatedProducts)
		})
	}

	delete() {
		getProductsFromFile(products => {
			const updatedProducts = products.filter(product => product.id !== this.id)
			this.writeToFile(updatedProducts)
		})
	}

	static fetchAll(cb) {
		getProductsFromFile(cb)
	}

	static findById(id, cb) {
		getProductsFromFile(products => {
			const product = products.find(p => p.id === id)
			cb(product)
		})
	}
}
