const fs = require("fs");
const express = require("express");
const formidable = require("formidable");
const path = require("path");

const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");

const db = require("../config/db.js");

router.get("/", forwardAuthenticated, (req, res) => {
	res.render("welcome", { user: req.user });
});

const resultsPerPage = 5;

router.get("/home", ensureAuthenticated, (req, res) => {
	let sql = "SELECT * FROM posts";
	db.query(sql, async (err, result) => {
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

		//Get the relevant number of POSTS for this starting page
		sql = `SELECT a.*, b.name, b.id
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
			res.render("home", {
				user: req.user,
				posts: result,
				userlikes: userlikes,
				page,
				iterator,
				endingLink,
				numberOfPages,
			});
		});
	});
});

const cloudinary = require("cloudinary");
require("dotenv").config();

cloudinary.config({
	cloud_name: process.env.CLOUD_NAME,
	api_key: process.env.CLOUD_API_KEY,
	api_secret: process.env.CLOUD_SECRET_KEY,
});

router.post("/post", ensureAuthenticated, async (req, res, next) => {
	const form = formidable({});

	form.options.keepExtensions = true;

	const uploadFolder = path.join(__dirname, "..", "public", "images");
	form.uploadDir = uploadFolder;

	// const ws = await cloudinary.v2.uploader.upload_stream((result) => {
	// 	(error, result) => {
	// 		if (result) {
	// 			resolve(result);
	// 		} else {
	// 			reject(error);
	// 		}
	// 	};
	// 	// console.log(result);
	// });
	// form.options.fileWriteStreamHandler = ws;

	form.parse(req, async (err, fields, files) => {
		if (err) {
			next(err);
			return;
		}
		let { post_Text, possibly_sensitive } = fields;
		possibly_sensitive = possibly_sensitive === "on" ? 1 : 0;

		if (files.image.size) {
			let image_url;
			await cloudinary.v2.uploader
				.upload(files.image.filepath)
				.then((result) => {
					console.log("media uploaded", result);
					image_url = result.url;
				});
			newPost = {
				text: post_Text,
				media: image_url,
				author_id: req.user.id,
				possibly_sensitive: possibly_sensitive,
			};
		} else {
			newPost = {
				text: post_Text,
				author_id: req.user.id,
				possibly_sensitive: possibly_sensitive,
			};
		}

		let sql = "INSERT INTO posts SET ?";

		db.query(sql, newPost, (err) => {
			if (err) throw err;
			console.log("post successful");
			req.flash("success_msg", "Posted successfully");
			res.redirect("/home");
		});

		fs.promises
			.unlink(files.image.filepath)
			.then(() =>
				Promise.resolve(
					`File '${files.image.newFilename}' deleted successfully`
				)
			)
			.catch(() =>
				Promise.reject(`Error deleting '${files.image.newFilename}'`)
			);
	});
});

router.get("/about", (req, res, next) => {
	res.render("about", { user: req.user });
});

module.exports = router;
