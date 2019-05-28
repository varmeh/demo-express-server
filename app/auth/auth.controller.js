exports.getLogin = (_, res) => {
	res.render('auth/login', { pageTitle: 'Login' })
}

exports.postLogin = (req, res) => {
	req.session.isLoggedIn = true
	res.redirect('/')
}
