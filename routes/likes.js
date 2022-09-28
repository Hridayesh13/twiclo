const express = require("express");
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");

const db = require("../config/db.js");
const resultsPerPage = 5;

router.post("/:post_id/users/:id", ensureAuthenticated, (req, res) => {
	let sql = `INSERT INTO likes (post_id, user_id)
            SELECT * FROM (SELECT ${req.params.post_id} AS post_id, ${req.params.id} AS user_id) AS tmp
            WHERE NOT EXISTS (
                SELECT post_id FROM likes WHERE post_id = ${req.params.post_id} AND user_id = ${req.params.id}
            ) LIMIT 1;`;

	let query = db.query(sql, (err, result) => {
		if (err) throw err;
		console.log("like successful");
		console.log(result.affectedRows);
		if (result.affectedRows != 0) {
			let sql1 = `UPDATE posts SET nLikes=nLikes+1 WHERE post_id=${req.params.post_id}`;

			let query1 = db.query(sql1, (err) => {
				if (err) throw err;
			});
			req.flash("success_msg", "Liked");
		} else {
			req.flash("success_msg", "Already Liked");
		}
		res.redirect(req.get("referer"));
	});
});

module.exports = router;
