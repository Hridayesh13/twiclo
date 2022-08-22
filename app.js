const express = require("express");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");

const app = express();

require("./config/passport")(passport);

const db = require("./config/db.js");
db.connect((error) => {
	if (!!error) {
		console.log(error);
		throw error;
	} else {
		console.log("Connected!: to database :)");
	}
});

app.use(express.static(path.join(__dirname, "public")));

app.use(expressLayouts);
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

// Express session
app.use(
	session({
		secret: "secret",
		resave: true,
		saveUninitialized: true,
	})
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function (req, res, next) {
	res.locals.success_msg = req.flash("success_msg");
	res.locals.error_msg = req.flash("error_msg");
	res.locals.error = req.flash("error");
	next();
});

app.use("/", require("./routes"));
app.use("/users", require("./routes/users"));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started at ${port}`));
