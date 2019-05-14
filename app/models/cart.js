const fs = require('fs')
const path = require('path')

const file = path.join(
	// eslint-disable-next-line no-undef
	path.dirname(process.mainModule.filename),
	'..',
	'cart.json'
)

module.exports = class Cart {
	/* 
        Cart data structure:
        - products - an array of products. Use this sequence to display Products in cart
        - quantity - an object with id: qunatity pairs
        - totalPrice - number
    */

	static save(cart) {
		fs.writeFile(file, JSON.stringify(cart), err => {
			if (err) {
				console.error(`Write Failed: Cart File: ${err.description}`)
			}
		})
	}

	static addProduct(product) {
		const { id } = product
		// Fetch cart from file
		fs.readFile(file, (err, fileContent) => {
			// If error, then no file exist. So initialize an empty cart
			let cart = err
				? { quantity: {}, totalPrice: 0, products: [] }
				: JSON.parse(fileContent)

			// Analyze cart for existing product
			if (cart.quantity[id] === undefined) {
				// Product not in cart
				cart.quantity[id] = 1
				cart.products.push(product)
			} else {
				// Product already in cart
				cart.quantity[id] += 1
			}
			cart.totalPrice += Number(product.price)

			Cart.save(cart)
		})
	}

	/*
		Removes product from cart.
		Parameter:
			- product object
	*/
	static removeProduct(id, cb) {
		// Fetch cart from file
		fs.readFile(file, (err, fileContent) => {
			if (err) {
				return
			}

			let cart = JSON.parse(fileContent)

			// Get product information from products array
			const product = cart.products.find(p => p.id === id)

			// Update total price
			cart.totalPrice -= Number(product.price) * Number(cart.quantity[id])

			// Remove quantity object
			delete cart.quantity[id]

			// Remove product from list
			cart.products = cart.products.filter(p => p.id !== id)

			// Save to cart
			Cart.save(cart)
			cb()
		})
	}

	static getCart(cb) {
		fs.readFile(file, (err, fileContent) => {
			cb(err ? null : JSON.parse(fileContent))
		})
	}
}
