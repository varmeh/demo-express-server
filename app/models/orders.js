const { Schema, model } = require('mongoose')

const orderSchema = new Schema({
	user: {
		_id: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true
		},
		name: {
			type: String,
			required: true
		},
		email: {
			type: String,
			required: true
		}
	},
	products: [
		{
			productData: {
				type: Object,
				required: true
			},
			quantity: {
				type: Number,
				required: true
			}
		}
	]
})

module.exports = new model('Order', orderSchema)
