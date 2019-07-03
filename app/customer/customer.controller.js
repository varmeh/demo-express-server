const PDFDocument = require('pdfkit')

const { Product, Order } = require('../models')
const { Error500 } = require('../error.manager')

const ITEMS_PER_PAGE = 2

exports.getIndex = async (req, res, next) => {
	// Setting default value of page to 1
	const { page = 1 } = req.query
	try {
		const totalItems = await Product.find().countDocuments()
		if (totalItems) {
			const products = await Product.find()
				.skip((page - 1) * ITEMS_PER_PAGE)
				.limit(ITEMS_PER_PAGE)

			res.render('customer/home', {
				pageTitle: 'Home',
				products: products,
				pages: Math.ceil(totalItems / ITEMS_PER_PAGE),
				currentPage: page
			})
		} else {
			throw new Error('No Products Found')
		}
	} catch (err) {
		next(new Error500(err.description))
	}
}

exports.getProducts = async (req, res, next) => {
	try {
		// Setting default value of page to 1
		const { page = 1 } = req.query
		const totalItems = await Product.find().countDocuments()

		if (totalItems) {
			const products = await Product.find()
				.skip((page - 1) * ITEMS_PER_PAGE)
				.limit(ITEMS_PER_PAGE)

			res.render('customer/product-list', {
				pageTitle: 'Products',
				products: products,
				pages: Math.ceil(totalItems / ITEMS_PER_PAGE),
				currentPage: page
			})
		} else {
			throw new Error('No Products Found')
		}
	} catch (err) {
		next(new Error500(err.description))
	}
}

exports.getProductDetails = async (req, res, next) => {
	try {
		const product = await Product.findById(req.params.productId)
		res.render('customer/product-detail', {
			pageTitle: product.title,
			product: product
		})
	} catch (err) {
		next(new Error500(err.description))
	}
}

exports.getCart = async (req, res, next) => {
	try {
		const user = await req.user.populate('cart.items.productId').execPopulate()
		res.render('customer/cart', {
			pageTitle: 'Cart',
			products: user.cart.items
		})
	} catch (err) {
		next(new Error500(err.description))
	}
}

exports.addToCart = async (req, res, next) => {
	try {
		const product = await Product.findById(req.body.productId)
		await req.user.addToCart(product)
		res.redirect('/cart')
	} catch (err) {
		next(new Error500(err.description))
	}
}

exports.removeProductFromCart = async (req, res, next) => {
	try {
		await req.user.removeFromCart(req.body.id)
		res.redirect('/cart')
	} catch (err) {
		next(new Error500(err.description))
	}
}

exports.getOrders = async (req, res, next) => {
	try {
		const orders = await Order.find({ 'user._id': req.user._id })
		res.render('customer/order', {
			pageTitle: 'Orders',
			orders: orders
		})
	} catch (err) {
		next(new Error500(err.description))
	}
}

exports.postOrder = async (req, res, next) => {
	try {
		const user = await req.user.populate('cart.items.productId').execPopulate()
		const products = user.cart.items.map(i => {
			const { _id, title, price, description, imageUrl } = i.productId
			return {
				productData: { _id, title, price, description, imageUrl },
				quantity: i.quantity
			}
		})
		const { _id, name, email } = req.user
		await new Order({ user: { _id, name, email }, products }).save()
		await req.user.clearCart()
		res.redirect('/orders')
	} catch (err) {
		next(new Error500(err.description))
	}
}

exports.getInvoice = (req, res, next) => {
	const { orderId } = req.params
	const invoiceName = `invoice-${orderId}.pdf`

	const pdfDoc = new PDFDocument()

	// Configure response headers
	res.setHeader('Content-type', 'application/pdf')
	res.setHeader('Content-Disposition', `attachment; filename="${invoiceName}"`)

	// Pipe all the data to res stream
	pdfDoc.pipe(res)

	// Add data to pdf stream
	pdfDoc.text(`Invoice for Order #${orderId}`)
	pdfDoc.end()
}
