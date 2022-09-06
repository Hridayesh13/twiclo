const express = require("express");
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");

const db = require("../config/db.js");

router.get("/:post_id", ensureAuthenticated, (req, res) => {
	let sql = `SELECT a.post_id, a.text, a.created_at, b.name, b.id
		FROM posts a, users b
		WHERE a.author_id = b.id AND a.post_id = ${req.params.post_id}`;

	db.query(sql, (err, results, fields) => {
		if (err) throw err;
		res.render("postComments", {
			post: results,
		});
		// res.send(results);
	});
	// res.send(req.params);
});

router.post("/:post_id/users/:id", ensureAuthenticated, (req, res) => {
	let newComment = {
		text: req.body.comment_Text,
		author_id: req.params.id,
		post_id: req.params.post_id,
	};

	let sql = "INSERT INTO comments SET ?";

	let query = db.query(sql, newComment, (err) => {
		if (err) throw err;
		console.log("comment successful");
		req.flash("success_msg", "Comment added successfully");
		res.redirect(`/comments/${req.params.post_id}`);
	});

	// res.send(newComment);
	// res.send(req.body);
});

module.exports = router;
