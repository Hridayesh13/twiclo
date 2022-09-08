const mysql = require("mysql");
const util = require("util");

const db = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "",
	database: "twiclone",
});

// promise wrapper to enable async await with MYSQL
db.query = util.promisify(db.query).bind(db);

// db.end();

module.exports = db;
