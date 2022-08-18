function myapp (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World');
}

var mysql = require('mysql');
var connection  = require('./lib/db');


module.exports = myapp;