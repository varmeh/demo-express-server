const { Product } = require('../models')

const defaultImageUrl =
	'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1s6Ti-mWnvN1RZuZP1QKbAYheT_YShWNyKdRgxBYebXTaucYR'

/* Renders UI for product addition */
exports.newProduct = (_, res) => {
	res.render('admin/edit-product', {
		pageTitle: 'Add Product',
		defaultUrl: defaultImageUrl,
		edit: false
	})
}

/* Save new product in db */
exports.postNewProduct = (req, res) => {
	const { title, image, price, description } = req.body
	const product = new Product({
		title,
		image,
		price,
		description,
		userId: req.user._id
	})

	product
		.save()
		.then(result => console.log(result))
		.then(() => res.redirect('/'))
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
				edit: true
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
	const updatedProduct = new Product(req.body)
	updatedProduct
		.save()
		.then(() => res.redirect('/admin/products'))
		.catch(err => console.log(err))
}

exports.deleteById = (req, res) => {
	Product.deleteById(req.body.id)
		.then(() => res.redirect('/admin/products'))
		.catch(err =>
			res.render('customer/error-info', {
				pageTitle: 'Deletion Failed',
				message: err.description
			})
		)
}

exports.getProducts = (_, res) => {
	Product.fetchAll()
		.then(products => {
			res.render('admin/products', {
				pageTitle: 'Admin Products',
				products: products
			})
		})
		.catch(err => console.log(err))
}
