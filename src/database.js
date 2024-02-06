const mysql = require('mysql2')

const connectDB = mysql.createPool({
    host: 'localhost', // host name
    user: 'root', // user name
    password: "", // password
    database: "ilk_volgger" // database name
});

module.exports = connectDB