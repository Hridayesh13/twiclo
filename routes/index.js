const express = require("express");
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");

const db = require("../config/db.js");

router.get("/", forwardAuthenticated, (req, res) => res.render("welcome"));

//How many posts we want to show on each page
const resultsPerPage = 5;

router.get("/home", ensureAuthenticated, (req, res) => {
	let sql = "SELECT * FROM posts";
	db.query(sql, (err, result) => {
		if (err) throw err;
		const numOfResults = result.length;
		const numberOfPages = Math.ceil(numOfResults / resultsPerPage);
		let page = req.query.page ? Number(req.query.page) : 1;
		if (page > numberOfPages) {
			res.redirect("/home/?page=" + encodeURIComponent(numberOfPages));
		} else if (page < 1) {
			page = 1;
			res.redirect("/home/?page=" + encodeURIComponent(page));
		}
		//Determine the SQL LIMIT starting number
		const startingLimit = (page - 1) * resultsPerPage;

		// console.log({ numOfResults, numberOfPages, page, startingLimit });

		//Get the relevant number of POSTS for this starting page
		sql = `SELECT a.post_id, a.text, a.created_at, b.name
		FROM posts a, users b
		WHERE a.author_id = b.id
		ORDER BY a.created_at DESC
		LIMIT ${startingLimit},${resultsPerPage}`;
		db.query(sql, (err, result) => {
			if (err) throw err;
			let iterator = page - 5 < 1 ? 1 : page - 5;
			let endingLink =
				iterator + 9 <= numberOfPages ? iterator + 9 : numberOfPages;
			if (endingLink < page + 4 && iterator > 4) {
				iterator -= page + 4 - numberOfPages;
			}
			// console.log({ iterator, endingLink });
			res.render("home", {
				user: req.user,
				posts: result,
				page,
				iterator,
				endingLink,
				numberOfPages,
			});
		});
	});
});

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
