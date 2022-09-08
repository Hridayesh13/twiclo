const express = require("express");
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");

const db = require("../config/db.js");

router.get("/:post_id", ensureAuthenticated, async (req, res) => {
	try {
		let sql1 = `SELECT a.post_id, a.text, a.created_at, b.name, b.id
		FROM posts a, users b
		WHERE a.author_id = b.id AND a.post_id = ${req.params.post_id}`;

		let post = await db.query(sql1).catch((e) => {
			throw e;
		});
		// res.json(post);

		let sql2 = `SELECT a.text, a.created_at, b.name, b.id
		FROM comments a, users b
		WHERE a.author_id = b.id AND a.post_id = ${req.params.post_id}
		ORDER BY a.created_at DESC`;

		let comments = await db.query(sql2).catch((e) => {
			throw e;
		});

		res.render("postComments", {
			post: post,
			comments: comments,
		});
	} catch (error) {
		console.log(error);
		res.sendStatus(500);
	}
});

router.post("/:post_id/users/:id", ensureAuthenticated, (req, res) => {
	let newComment = {
		text: req.body.comment_Text,
		author_id: req.user.id,
		post_id: req.params.post_id,
	};

	let sql = "INSERT INTO comments SET ?";

	let query = db.query(sql, newComment, (err) => {
		if (err) throw err;
		console.log("comment successful");
		req.flash("success_msg", "Comment added successfully");
		res.redirect(`/comments/${req.params.post_id}`);
	});
});

module.exports = router;
