const { validationResult } = require('express-validator/check')
const { Product } = require('../models')
const { Error500, Error404, ErrorCustom } = require('../error.manager')

const defaultImageUrl =
	'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1s6Ti-mWnvN1RZuZP1QKbAYheT_YShWNyKdRgxBYebXTaucYR'

/* Renders UI for product addition */
exports.newProduct = (req, res) => {
	res.render('admin/edit-product', {
		pageTitle: 'Add Product',
		defaultUrl: defaultImageUrl,
		edit: false,
		errorMessage: null
	})
}

/* Save new product in db */
exports.postNewProduct = async (req, res, next) => {
	const { title, imageUrl, price, description } = req.body
	const errors = validationResult(req)

	if (!errors.isEmpty()) {
		return res.status(422).render('admin/edit-product', {
			pageTitle: 'Add Product',
			edit: true,
			product: { title, imageUrl, price, description },
			errorMessage: errors.array()[0].msg
		})
	}

	try {
		await new Product({
			title,
			imageUrl,
			price,
			description,
			userId: req.user._id
		}).save()

		res.redirect('/')
	} catch (err) {
		next(new Error500(err))
	}
}

/* UI for editing existing product */
exports.editProduct = async (req, res, next) => {
	try {
		const product = await Product.findById(req.params.id)
		res.render('admin/edit-product', {
			pageTitle: 'Edit Product',
			product: product,
			edit: true,
			errorMessage: null
		})
	} catch (err) {
		next(new Error404(err.description, 'Missing Product'))
	}
}

/* Update existing product in db */
exports.postUpdateProduct = async (req, res, next) => {
	const { title, description, imageUrl, price, id } = req.body
	const errors = validationResult(req)

	if (!errors.isEmpty()) {
		return res.status(422).render('admin/edit-product', {
			pageTitle: 'Edit Product',
			edit: true,
			product: { title, imageUrl, price, description, _id: id },
			errorMessage: errors.array()[0].msg
		})
	}

	try {
		// Fetch product
		const product = await Product.findById(id)
		product.title = title
		product.description = description
		product.price = price
		product.imageUrl = imageUrl

		// Save product with updated information
		await product.save()
		res.redirect('/admin/products')
	} catch (err) {
		next(new Error404(err.description, 'Missing Product'))
	}
}

exports.deleteById = async (req, res, next) => {
	try {
		await Product.deleteOne({ _id: req.body.id, userId: req.user._id })
		res.redirect('/admin/products')
	} catch (err) {
		next(new ErrorCustom(err.description, 'Deletion Failed', 401))
	}
}

exports.getProducts = async (req, res, next) => {
	try {
		const products = await Product.find({ userId: req.user._id })
		res.render('admin/products', {
			pageTitle: 'Admin Products',
			products: products
		})
	} catch (err) {
		next(new Error404(err.description, 'No Products found'))
	}
}
