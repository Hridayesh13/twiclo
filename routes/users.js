const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");

const db = require("../config/db.js");

router.get("/login", (req, res) => res.render("login"));

router.get("/register", (req, res) => res.render("register"));

router.post("/register", (req, res, next) => {
	const { name, email, password, password2 } = req.body;
	let errors = [];

	if (!name || !email || !password || !password2) {
		errors.push({ msg: "Please enter all fields" });
	}

	if (password != password2) {
		errors.push({ msg: "Passwords do not match" });
	}

	if (password.length < 6) {
		errors.push({ msg: "Password must be at least 6 characters" });
	}

	if (errors.length > 0) {
		res.render("register", {
			errors,
			name,
			email,
			password,
			password2,
		});
	} else {
		db.query(
			`SELECT * FROM users WHERE email='${email}'`,
			function (err, result, fields) {
				if (err) throw err;
				if (result[0]) {
					//user exists
					console.log(result);
					errors.push({ msg: "Email is already registered" });
					res.render("register", {
						errors,
						name,
						email,
						password,
						password2,
					});
				} else {
					//new user
					const newUser = {
						name: name,
						email: email,
						password: password,
					};

					//hash password
					bcrypt.genSalt(10, (err, salt) =>
						bcrypt.hash(newUser.password, salt, (err, hash) => {
							if (err) throw err;
							newUser.password = hash;
							console.log(newUser);
							let sql = "INSERT INTO users SET ?";

							let query = db.query(sql, newUser, (err) => {
								if (err) throw err;
								req.flash(
									"success_msg",
									"You are now registered and can log in"
								);
								res.redirect("/users/login");
							});
						})
					);
				}
			}
		);
	}
});

// Login
router.post("/login", (req, res, next) => {
	passport.authenticate("local", {
		successRedirect: "/home",
		failureRedirect: "/users/login",
		failureFlash: true,
	})(req, res, next);
});

// Logout
router.get("/logout", (req, res, next) => {
	req.logout((err) => {
		if (err) {
			return next(err);
		}
		req.flash("success_msg", "You are logged out");
		res.redirect("/users/login");
	});
});

module.exports = router;
