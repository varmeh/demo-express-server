/* eslint-disable no-undef */
const fs = require('fs')
const path = require('path')

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
		title = '',
		image = '',
		description = 'A Book',
		type = 'Books',
		price = '9.99$'
	}) {
		this.title = title
		this.image = image
		this.type = type
		this.price = price
		this.description = description
	}

	save() {
		getProductsFromFile(products => {
			products.push(this)
			fs.writeFile(file, JSON.stringify(products), err => console.log(err))
		})
	}

	static fetchAll(cb) {
		getProductsFromFile(cb)
	}
}
