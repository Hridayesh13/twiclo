//this file is not used

const express = require("express");
const router = express.Router();

const validator = require("express-validator");
const body = validator.body;
const validationResult = validator.validationResult;

router.get("/", (req, res) => res.send("register"));

module.exports = router;
