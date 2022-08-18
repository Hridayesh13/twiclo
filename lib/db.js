var mysql=require('mysql');

var connection = mysql.createConnection({
   host:'localhost',
   user:'root',
   password:'',
   database:'twiclone'
});

connection.connect(function(error){
    if (!!error) {
        console.log(error);
    } else {
        console.log('Connected!: to database)');
   }
});

module.exports = connection;