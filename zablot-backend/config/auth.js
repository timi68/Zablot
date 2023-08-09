const ensureIsAuthenticated = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next();
	} else {
		res.redirect("/");
		res.end();
	}
};

module.exports = ensureIsAuthenticated;
