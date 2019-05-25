exports.getLogin = (_, res) => {
	res.render('auth/login', { pageTitle: 'Login' })
}
