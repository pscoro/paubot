const mysql = require("mysql2/promise");
require('dotenv').config();


const MYSQL_HOST = process.env.MYSQL_HOST;
const MYSQL_USERNAME = process.env.MYSQL_USERNAME;
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD;
const MYSQL_MAIN_DATABASE = process.env.MYSQL_MAIN_DATABASE;
const MYSQL_PORT = process.env.MYSQL_PORT;


/* Database connection */
module.exports = mysql.createConnection({
    host: MYSQL_HOST,
    user: MYSQL_USERNAME,
    password: MYSQL_PASSWORD,
    database: MYSQL_MAIN_DATABASE,
    port: MYSQL_PORT
});
