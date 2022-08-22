const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

// Load User model
const connection = require("../config/db.js");

module.exports = function (passport) {
	// passport session setup
	// required for persistent login sessions
	// passport needs ability to serialize and deserialize users out of session

	// used to serialize the user for the session
	passport.serializeUser((user, done) => {
		done(null, user.id);
	});

	// used to deserialize the user
	passport.deserializeUser(function (id, done) {
		connection.query(`select * from users where id=${id}`, (err, rows) => {
			done(err, rows[0]);
		});
	});

	passport.use(
		new LocalStrategy(
			{ usernameField: "email" },
			(email, password, done) => {
				// Match user
				connection.query(
					`SELECT * FROM users WHERE email='${email}'`,
					(err, result, fields) => {
						if (err) throw err;

						const user = result[0];
						if (!user) {
							return done(null, false, {
								message: "That email is not registered",
							});
						}

						// Match password
						bcrypt.compare(
							password,
							user.password,
							(err, isMatch) => {
								if (err) throw err;
								if (isMatch) {
									return done(null, user);
								} else {
									return done(null, false, {
										message: "Password incorrect",
									});
								}
							}
						);
					}
				);
			}
		)
	);
};
