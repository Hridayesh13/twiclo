const express = require("express");
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");

const db = require("../config/db.js");
const resultsPerPage = 5;

router.get("/:post_id", ensureAuthenticated, async (req, res) => {
	try {
		// res.send(req.params);
		let sql1 = `SELECT a.post_id, a.text, a.created_at, b.name, b.id
					FROM posts a, users b
					WHERE a.author_id = b.id AND a.post_id = ${req.params.post_id}`;

		let post = await db.query(sql1).catch((e) => {
			throw e;
		});

		let sql2 = `SELECT * from comments WHERE post_id = ${req.params.post_id}`;

		let comments = await db.query(sql2).catch((e) => {
			throw e;
		});

		const numOfResults = comments.length;

		if (numOfResults === 0) {
			res.render("postComments", {
				post: post,
				comments: comments,
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
					`/comments/${req.params.post_id}/?page=` +
						encodeURIComponent(numberOfPages)
				);
			} else if (page < 1) {
				page = 1;
				res.redirect(
					`/comments/${req.params.post_id}/?page=` +
						encodeURIComponent(page)
				);
			}
			//Determine the SQL LIMIT starting number
			const startingLimit = (page - 1) * resultsPerPage;

			//Get the relevant number of POSTS for this starting page
			sql = `SELECT a.text, a.created_at, b.name, b.id
					FROM comments a, users b
					WHERE a.author_id = b.id AND a.post_id = ${req.params.post_id}
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
				res.render("postComments", {
					post: post,
					comments: result,
					page,
					iterator,
					endingLink,
					numberOfPages,
				});
			});
		}
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
