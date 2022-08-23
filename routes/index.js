const express = require("express");
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");

router.get("/", forwardAuthenticated, (req, res) => res.render("welcome"));

router.get("/home", ensureAuthenticated, (req, res) =>
	res.render("home", {
		user: req.user,
	})
);

router.get("/compose/post", ensureAuthenticated, (req, res) =>
	res.render("post")
);

router.post("/compose/post", ensureAuthenticated, (req, res) => {
	const { post_Text, image } = req.body;
	let newPost = {
		text: post_Text,
		attachments: image,
		author_id: req.user.id,
		possibly_sensitive: false,
	};
	res.send(newPost);
});

module.exports = router;
