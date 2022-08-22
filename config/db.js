const mysql = require("mysql");

const db = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "",
	database: "twiclone",
});

// connection.end();

module.exports = db;
