exports.getLogin = (_, res) => {
	res.render('auth/login', { pageTitle: 'Login' })
}

exports.postLogin = (_, res) => {
	res.setHeader('Set-Cookie', 'loggedIn=true')
	res.redirect('/')
}
