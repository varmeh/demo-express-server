const { validationResult } = require('express-validator/check')
const { Product } = require('../models')
const { Error500, Error404, ErrorCustom } = require('../error.manager')
const { deleteFile } = require('../../util/file')

/* Renders UI for product addition */
exports.newProduct = (req, res) => {
	res.render('admin/edit-product', {
		pageTitle: 'Add Product',
		edit: false,
		errorMessage: null
	})
}

/* Save new product in db */
exports.postNewProduct = async (req, res, next) => {
	const { title, price, description } = req.body
	const image = req.file
	if (!image) {
		return res.status(422).render('admin/edit-product', {
			pageTitle: 'Add Product',
			edit: true,
			product: { title, price, description },
			errorMessage: 'Attach a png, jpg or jpeg image only'
		})
	}
	const errors = validationResult(req)

	if (!errors.isEmpty()) {
		return res.status(422).render('admin/edit-product', {
			pageTitle: 'Add Product',
			edit: true,
			product: { title, price, description },
			errorMessage: errors.array()[0].msg
		})
	}

	try {
		await new Product({
			title,
			imageUrl: image.path,
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
exports.postEditProduct = async (req, res, next) => {
	const { title, description, price, id } = req.body
	const image = req.file

	const errors = validationResult(req)

	if (!errors.isEmpty()) {
		return res.status(422).render('admin/edit-product', {
			pageTitle: 'Edit Product',
			edit: true,
			product: { title, price, description, _id: id },
			errorMessage: errors.array()[0].msg
		})
	}

	try {
		// Fetch product
		const product = await Product.findById(id)
		product.title = title
		product.description = description
		product.price = price
		if (image) {
			// Delete older image
			deleteFile(product.imageUrl)
			product.imageUrl = image.path
		}

		// Save product with updated information
		await product.save()
		res.redirect('/admin/products')
	} catch (err) {
		next(new Error404(err.description, 'Missing Product'))
	}
}

exports.deleteProduct = async (req, res, next) => {
	try {
		const { productId } = req.params
		const product = await Product.findById(productId)

		if (!product) {
			throw new Error('Product not found')
		}
		await Product.deleteOne({ _id: productId, userId: req.user._id })
		deleteFile(product.imageUrl) // Delete older image

		res.status(200).json({ message: 'Success' })
	} catch (err) {
		console.log(`Error: ${err.description}`)
		res.status(500).json({ error: err.description })
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
