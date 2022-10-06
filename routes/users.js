const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");

const db = require("../config/db.js");

router.get("/login", (req, res) => res.render("login", { user: req.user }));

router.get("/register", (req, res) =>
	res.render("register", { user: req.user })
);

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
			user: req.user,
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
						user: req.user,
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

const resultsPerPage = 5;

router.get("/:id", ensureAuthenticated, (req, res) => {
	let sql = `SELECT * FROM posts WHERE author_id = ${req.params.id}`;
	db.query(sql, (err, result) => {
		if (err) throw err;

		let sql1 = `SELECT post_id FROM likes WHERE user_id=${req.user.id} ORDER BY post_id DESC`;
		let userlikes = [];
		db.query(sql1, (err, result) => {
			if (err) throw err;
			for (let i = 0; i < result.length; i++) {
				userlikes.push(result[i].post_id);
			}
		});

		const numOfResults = result.length;
		if (numOfResults === 0) {
			res.render("profile", {
				user: req.user,
				posts: result,
				userlikes: userlikes,
				page: 1,
				iterator: 1,
				endingLink: 1,
				numberOfPages: 1,
			});
		} else {
			const numberOfPages = Math.ceil(numOfResults / resultsPerPage);
			let page = req.query.page ? Number(req.query.page) : 1;
			if (page > numberOfPages) {
				res.redirect(
					"/users/:id/?page=" + encodeURIComponent(numberOfPages)
				);
			} else if (page < 1) {
				page = 1;
				res.redirect("/users/:id/?page=" + encodeURIComponent(page));
			}
			//Determine the SQL LIMIT starting number
			const startingLimit = (page - 1) * resultsPerPage;

			//Get the relevant number of POSTS for this starting page
			sql = `SELECT a.*, b.name, b.id
		FROM posts a, users b 
		WHERE a.author_id = b.id AND a.author_id = ${req.params.id}
		ORDER BY a.created_at DESC
		LIMIT ${startingLimit},${resultsPerPage}`;
			db.query(sql, (err, result) => {
				if (err) throw err;
				let iterator = page - 5 < 1 ? 1 : page - 5;
				let endingLink =
					iterator + 9 <= numberOfPages
						? iterator + 9
						: numberOfPages;
				if (endingLink < page + 4 && iterator > 4) {
					iterator -= page + 4 - numberOfPages;
				}
				res.render("profile", {
					user: req.user,
					posts: result,
					userlikes: userlikes,
					page,
					iterator,
					endingLink,
					numberOfPages,
				});
			});
		}
	});
});

router.post(
	"/:id/posts/:postId/delete",
	ensureAuthenticated,
	async (req, res, next) => {
		let sql1 = `DELETE FROM comments WHERE post_id=${req.params.postId}`;
		await db.query(sql1).catch((err) => {
			throw err;
		});

		let sql2 = `DELETE FROM likes WHERE post_id=${req.params.postId}`;
		await db.query(sql2).catch((err) => {
			throw err;
		});

		let sql = `DELETE FROM posts WHERE post_id=${req.params.postId}`;
		db.query(sql, async (err) => {
			if (err) throw err;
			console.log("deleted successfully");
			req.flash("success_msg", "Post Deleted");
			res.redirect(`/users/${req.params.id}`);
		});
	}
);

router.post("/delete_user", ensureAuthenticated, (req, res, next) => {
	let sql = `UPDATE users
				SET name='deleted_user',
				email='deleted_credentials'
				WHERE id=${req.user.id}`;

	db.query(sql, (err) => {
		if (err) throw err;
		console.log("user deleted successfully");
		req.flash("success_msg", "Account Deleted");
		res.redirect(`/users/login`);
	});
});

module.exports = router;
