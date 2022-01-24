const { users_auth: dbs } = require("../connection/mongodb.js");
const passport = require("passport");
const { Strategy: LocalStrategy } = require("passport-local");
const bcrypt = require("bcryptjs");

passport.use(
	"localSignin",
	new LocalStrategy(
		{
			usernameField: "userEmail",
			passwordField: "userPassword",
		},
		function (userEmail, userPassword, next) {
			// Find the user
			if (userEmail != undefined) {
				dbs.findOne({ Email: userEmail }, (err, user) => {
					user != null && !err
						? bcrypt.compare(
								userPassword,
								user.Password,
								(err, isMatch) => {
									if (err) throw err;

									isMatch
										? next(null, user)
										: next(null, false, {
												message:
													"Password is incorrect",
										  });
								}
						  )
						: !err
						? next(null, false, {
								message:
									"This e-mail address is not registered.",
						  })
						: next(null, false, {
								message:
									"There is an error with base.. resolving issue",
						  });
				});
			}
		}
	)
);
passport.serializeUser(function (user, next) {
	// Serialize the user in the session
	next(null, user.id);
});

passport.deserializeUser(function (id, next) {
	// Use the previously serialized user
	dbs.findById(id, (err, user) => {
		user != null && !err
			? next(null, user)
			: next(null, false, { message: "Error" });
	});
});
