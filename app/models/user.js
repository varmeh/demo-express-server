const { ObjectID } = require('mongodb')
const { getdb } = require('../util/database')

const collections = require('./collections')
class User {
	constructor({ name = '', email = '', cart = { items: [] }, id = null }) {
		this.name = name
		this.email = email
		this.cart = cart
		this._id = id
	}

	save() {
		return getdb()
			.collection(collections.users)
			.insertOne(this)
	}

	static findById(userId) {
		return getdb()
			.collection(collections.users)
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
			.collection(collections.products)
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
			.collection(collections.users)
			.updateOne({ _id: this._id }, { $set: { cart: { items: cartItems } } })
	}

	/* Methods for order addition */
	addOrder() {
		return this.getCartProducts()
			.then(products => {
				const order = {
					user: {
						_id: this._id,
						name: this.name,
						email: this.email
					},
					items: products
				}
				return getdb()
					.collection(collections.orders)
					.insertOne(order)
			})
			.then(result => {
				console.log(result)
				this.cart = { items: [] }
				return this.updateCartItems([])
			})
	}

	getOrders() {}
}

module.exports = User
