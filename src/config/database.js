// Import Pool from pg to manage database Connections
const { Pool } = require('pg');
// Import environment variable that store database credentials
require("dotenv").config();
// Create a pool (onnetion settings)
const pool = new Pool({
    user: process.env.DB_USER, // username
    host: process.env.DB_HOST, // database host
    database: process.env.DB_NAME, // name of the database
    password: process.env.DB_PASSWORD, // name of the database
    port: process.env.DB_PORT,
});
// Eport Pool so that other files can use it
module.exports = pool;