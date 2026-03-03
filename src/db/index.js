// expose helper as module entry point
const QueryHelper = require("./QueryHelper");

// function receives db connection
module.exports = (db) => new QueryHelper(db);