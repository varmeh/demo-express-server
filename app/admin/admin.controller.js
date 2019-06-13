const { validationResult } = require('express-validator/check')
const { Product } = require('../models')

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
exports.postNewProduct = (req, res) => {
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

	new Product({
		title,
		imageUrl,
		price,
		description,
		userId: req.user._id
	})
		.save()
		.then(result => {
			console.log(result)
			res.redirect('/')
		})
		.catch(err => {
			console.log(err)
			res.render('customer/error-info', {
				pageTitle: 'New Product Error',
				message: err.description
			})
		})
}

/* UI for editing existing product */
exports.editProduct = (req, res) => {
	Product.findById(req.params.id)
		.then(product => {
			res.render('admin/edit-product', {
				pageTitle: 'Edit Product',
				product: product,
				edit: true,
				errorMessage: null
			})
		})
		.catch(err => {
			console.log(err)
			res.render('customer/error-info', {
				pageTitle: 'Missing Product',
				message: err.description
			})
		})
}

/* Update existing product in db */
exports.postUpdateProduct = (req, res) => {
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

	Product.findById(id)
		.then(product => {
			product.title = title
			product.description = description
			product.price = price
			product.imageUrl = imageUrl

			return product.save().then(() => res.redirect('/admin/products'))
		})
		.catch(err => console.log(err))
}

exports.deleteById = (req, res) => {
	Product.deleteOne({ _id: req.body.id, userId: req.user._id })
		.then(result => {
			console.log(result)
			res.redirect('/admin/products')
		})
		.catch(err =>
			res.render('customer/error-info', {
				pageTitle: 'Deletion Failed',
				message: err.description
			})
		)
}

exports.getProducts = (req, res) => {
	Product.find({ userId: req.user._id })
		.then(products => {
			res.render('admin/products', {
				pageTitle: 'Admin Products',
				products: products
			})
		})
		.catch(err => console.log(err))
}
