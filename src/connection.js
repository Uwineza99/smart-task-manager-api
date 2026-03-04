// Import the PostgreSQL pool
const pool = require("./config/database");

// Import your QueryHelper factory
const createDB = require("./db");

// Create ONE shared database instance
// Every repository will use this
const db = createDB(pool);

// Export the shared instance
module.exports = db;