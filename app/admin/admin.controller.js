const { Product, Cart } = require('../models')

const defaultImageUrl =
	'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1s6Ti-mWnvN1RZuZP1QKbAYheT_YShWNyKdRgxBYebXTaucYR'

/* Renders UI for product addition */
exports.newProduct = (_, res) => {
	res.render('admin/edit-product', {
		pageTitle: 'Add Product',
		url: defaultImageUrl,
		edit: false
	})
}

/* Save new product in db */
exports.saveProduct = (req, res) => {
	const { title, image, price, description } = req.body
	req.user
		.createProduct({ title, description, price, image })
		.then(() => res.redirect('/'))
		.catch(err =>
			res.render('customer/error-info', {
				pageTitle: 'Save Product',
				message: err.description
			})
		)
}

/* UI for editing existing product */
exports.editProduct = (req, res) => {
	Product.findByPk(req.params.id)
		.then(product => {
			res.render('admin/edit-product', {
				pageTitle: 'Edit Product',
				url: product.image,
				product: product,
				edit: true
			})
		})
		.catch(err => {
			res.render('customer/error-info', {
				pageTitle: 'Missing Product',
				message: err.description
			})
		})
}

/* Update existing product in db */
exports.updateProduct = (req, res) => {
	const { id, title, image, price, description } = req.body
	Product.findByPk(id)
		.then(product => {
			product.title = title
			product.image = image
			product.price = price
			product.description = description
			return product.save()
		})
		.then(() => res.redirect('/admin/products'))
		.catch(err => console.log(err))
}

exports.deleteById = (req, res) => {
	Product.destroy({
		where: {
			id: req.body.id
		}
	})
		.then(() => res.redirect('/admin/products'))
		.catch(err =>
			res.render('customer/error-info', {
				pageTitle: 'Deletion Failed',
				message: err.description
			})
		)
}

exports.getProducts = (_, res) => {
	Product.findAll()
		.then(products => {
			res.render('admin/products', {
				pageTitle: 'Admin Products',
				products: products
			})
		})
		.catch(err => console.log(err))
}
