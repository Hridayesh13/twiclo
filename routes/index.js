const express = require("express");
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");

const db = require("../config/db.js");

router.get("/", forwardAuthenticated, (req, res) => res.render("welcome"));

router.get("/home", ensureAuthenticated, (req, res) => {
	db.query(
		`SELECT * FROM posts ORDER BY created_at DESC`,
		(err, result, fields) => {
			if (err) throw err;
			// res.write(result);
			res.render("home", {
				user: req.user,
				posts: result,
			});
		}
	);
});

// router.get("/compose/post", ensureAuthenticated, (req, res) =>
// 	res.render("compose/post")
// );

router.post("/post", ensureAuthenticated, (req, res) => {
	let { post_Text, possibly_sensitive } = req.body;

	if (possibly_sensitive === "on") {
		possibly_sensitive = 1;
	} else {
		possibly_sensitive = 0;
	}

	let newPost = {
		text: post_Text,
		// attachments: image,
		author_id: req.user.id,
		possibly_sensitive: possibly_sensitive,
	};

	let sql = "INSERT INTO posts SET ?";

	let query = db.query(sql, newPost, (err) => {
		if (err) throw err;
		console.log("post successful");
		req.flash("success_msg", "Posted successfully");
		res.redirect("/home");
		// res.send(newPost);
	});
});

module.exports = router;
