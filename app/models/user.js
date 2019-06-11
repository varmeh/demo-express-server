const { Schema, model } = require('mongoose')

const userSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	resetToken: String,
	resetTokenExpiration: Date,
	cart: {
		items: [
			{
				productId: {
					type: Schema.Types.ObjectId,
					ref: 'Product',
					required: true
				},
				quantity: { type: Number, required: true }
			}
		]
	}
})
/* Attach methods to schema */

userSchema.methods.addToCart = function(product) {
	const productIndex = this.cart.items.findIndex(
		cartProduct => cartProduct.productId.toString() === product._id.toString()
	)

	let updatedCartItems = [...this.cart.items]
	if (productIndex >= 0) {
		// Product already in cart
		let newQuantity = this.cart.items[productIndex].quantity + 1
		updatedCartItems[productIndex].quantity = newQuantity
	} else {
		updatedCartItems.push({ productId: product._id, quantity: 1 })
	}

	this.cart.items = updatedCartItems
	return this.save()
}

userSchema.methods.removeFromCart = function(id) {
	this.cart.items = this.cart.items.filter(
		i => i.productId.toString() !== id.toString()
	)

	return this.save()
}

userSchema.methods.clearCart = function() {
	this.cart.items = []
	return this.save()
}

module.exports = new model('User', userSchema)
