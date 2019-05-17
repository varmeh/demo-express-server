const Product = require('../models/product')
const Cart = require('../models/cart')

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
	new Product({ title, image, price, description })
		.save()
		.then(() => res.redirect('/'))
		.catch(err => console.log(err))
}

/* UI for editing existing product */
exports.editProduct = (req, res) => {
	Product.findById(req.params.id)
		.then(([rows]) => {
			if (rows.length === 0) {
				res.render('customer/error-info', {
					pageTitle: 'Missing Product',
					message: 'Product not found!!!'
				})
			}
			res.render('admin/edit-product', {
				pageTitle: 'Edit Product',
				url: rows[0].image,
				product: rows[0],
				edit: true
			})
		})
		.catch(err => console.log(err))
}

/* Update existing product in db */
exports.updateProduct = (req, res) => {
	const { id, title, image, price, description } = req.body
	new Product({ id, title, image, price, description })
		.update()
		.then(() => res.redirect('/'))
		.catch(err => console.log(err))
}

exports.deleteById = (req, res) => {
	new Product({ id: req.body.id }).delete()
	res.redirect('/')
}

exports.getProducts = (_, res) => {
	Product.fetchAll()
		.then(([rows]) => {
			res.render('admin/products', {
				pageTitle: 'Admin Products',
				products: rows
			})
		})
		.catch(err => console.log(err))
}

exports.removeProductFromCart = (req, res) => {
	Cart.removeProduct(req.body.id, () => res.redirect('/cart'))
}
