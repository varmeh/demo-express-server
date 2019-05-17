const db = require('../util/database')

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

	save() {
		return db.execute(
			'INSERT INTO products (title, price, description, type, image) VALUES (?, ?, ?, ?, ?)',
			[this.title, this.price, this.description, this.type, this.image]
		)
	}

	update() {
		return db.execute(
			'UPDATE products SET title=?, price=?, description=?, image=? WHERE products.id = ?',
			[this.title, this.price, this.description, this.image, this.id]
		)
	}

	delete() {
		return db.execute('DELETE FROM products WHERE products.id = ?', [this.id])
	}

	static fetchAll() {
		return db.execute('SELECT * FROM products')
	}

	static findById(id) {
		return db.execute('SELECT * FROM products WHERE products.id = ?', [id])
	}
}
