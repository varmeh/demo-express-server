const { Product } = require('../models')

const defaultImageUrl =
	'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1s6Ti-mWnvN1RZuZP1QKbAYheT_YShWNyKdRgxBYebXTaucYR'

/* Renders UI for product addition */
exports.newProduct = (req, res) => {
	res.render('admin/edit-product', {
		pageTitle: 'Add Product',
		defaultUrl: defaultImageUrl,
		edit: false,
		isAuthenticated: req.session.user != null
	})
}

/* Save new product in db */
exports.postNewProduct = (req, res) => {
	const { title, imageUrl, price, description } = req.body
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
				isAuthenticated: req.session.user != null
			})
		})
		.catch(err => {
			console.log(err)
			res.render('customer/error-info', {
				pageTitle: 'Missing Product',
				message: err.description,
				isAuthenticated: req.session.user != null
			})
		})
}

/* Update existing product in db */
exports.postUpdateProduct = (req, res) => {
	const { title, description, imageUrl, price, id } = req.body
	Product.findById(id)
		.then(product => {
			product.title = title
			product.description = description
			product.price = price
			product.imageUrl = imageUrl

			return product.save()
		})
		.then(() => res.redirect('/admin/products'))
		.catch(err => console.log(err))
}

exports.deleteById = (req, res) => {
	Product.findByIdAndRemove(req.body.id)
		.then(() => res.redirect('/admin/products'))
		.catch(err =>
			res.render('customer/error-info', {
				pageTitle: 'Deletion Failed',
				message: err.description,
				isAuthenticated: req.session.user != null
			})
		)
}

exports.getProducts = (req, res) => {
	Product.find()
		.then(products => {
			res.render('admin/products', {
				pageTitle: 'Admin Products',
				products: products,
				isAuthenticated: req.session.user != null
			})
		})
		.catch(err => console.log(err))
}
