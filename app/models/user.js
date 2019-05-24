const { ObjectID } = require('mongodb')
const { getdb } = require('../util/database')

const collectionName = 'users'
class User {
	constructor({ username = '', email = '', cart = { items: [] }, id = null }) {
		this.username = username
		this.email = email
		this.cart = cart
		this._id = id
	}

	save() {
		return getdb()
			.collection(collectionName)
			.insertOne(this)
	}

	static findById(userId) {
		return getdb()
			.collection(collectionName)
			.find({ _id: new ObjectID(userId) })
			.next()
	}

	/* Methods for cart modification */
	getCartProducts() {
		const quantityMap = {}
		const productIds = this.cart.items.map(i => {
			quantityMap[i.productId.toString()] = i.quantity
			return i.productId
		})

		return getdb()
			.collection('products')
			.find({ _id: { $in: productIds } })
			.toArray()
			.then(products =>
				products.map(product => {
					return {
						...product,
						quantity: quantityMap[product._id.toString()]
					}
				})
			)
	}

	addToCart(product) {
		const productIndex = this.cart.items.findIndex(
			cartProduct => cartProduct.productId.toString() === product._id.toString()
		)
		let newQuantity = 1
		let updatedCartItems = [...this.cart.items]

		if (productIndex >= 0) {
			// Product already in cart
			newQuantity = this.cart.items[productIndex].quantity + 1
			updatedCartItems[productIndex].quantity = newQuantity
		} else {
			updatedCartItems.push({ productId: product._id, quantity: 1 })
		}

		return this.updateCartItems(updatedCartItems)
	}

	deleteFromCart(id) {
		const updatedCartItems = this.cart.items.filter(
			i => i.productId.toString() !== id.toString()
		)

		return this.updateCartItems(updatedCartItems)
	}

	updateCartItems(cartItems) {
		return getdb()
			.collection(collectionName)
			.updateOne({ _id: this._id }, { $set: { cart: { items: cartItems } } })
	}
}

module.exports = User
