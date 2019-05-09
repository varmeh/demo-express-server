const Product = require('./product.model')

exports.newProduct = (_, res) => {
	res.render('admin/add-product', { pageTitle: 'Add Product' })
}

exports.saveProduct = (req, res) => {
	new Product({ title: req.body.title }).save()
	res.redirect('/')
}
