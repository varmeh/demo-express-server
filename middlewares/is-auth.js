module.exports = (req, res, next) => {
	// Redirect to home route, if user not logged in
	if (!req.session.user) {
		res.redirect('/login')
	} else {
		next()
	}
}
