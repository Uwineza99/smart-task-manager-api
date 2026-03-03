// import dependencies
const QueryState = require("./QueryState");
const SQLCompiler = require("./SQLCompiler");
const { QueryError } = require("./errors");

class QueryHelper {

  constructor(db) {
    this.db = db;                 // database connection
    this.state = new QueryState(); // create new query state
  }

  // choose table
  table(name) {
    this.state.table = name; // store table name
    return this; // allow chaining
  }

  // select fields
  select(...fields) {
    this.state.select = fields;
    return this;
  }

  // where conditions
  where(conditions) {

    // convert object into array conditions
    Object.entries(conditions).forEach(([field, value]) => {
      this.state.where.push({ field, value });
    });

    return this;
  }

  limit(n) {
    this.state.limit = n;
    return this;
  }

  offset(n) {
    this.state.offset = n;
    return this;
  }

  orderBy(field, direction = "ASC") {
    this.state.orderBy = { field, direction };
    return this;
  }

  // GET 
  async get() {

    const sql = SQLCompiler.compileSelect(this.state); // build SQL

    const result = await this.db.query(sql); // execute SQL

    this.state.reset(); // REQUIRED RULE

    return result.rows;
  }

  // find by id
  async findById(id) {
    return this.where({ id }).limit(1).get();
  }

  // find one by condition
  async findOne(condition) {
    return this.where(condition).limit(1).get();
  }

  // first N records
  async findFirst(n = 1) {
    return this.limit(n).get();
  }

  // last N records
  async findLast(n = 1) {
    this.orderBy("id", "DESC");
    return this.limit(n).get();
  }
    // CREATE 
  async create(data) {

    if (!data || Object.keys(data).length === 0)
      throw new QueryError("Empty insert object");

    this.state.data = data;

    const sql =
      SQLCompiler.compileInsert(this.state);

    const result =
      await this.db.query(sql);

    this.state.reset();

    return result.rows[0];
  }

  // UPDATE
  async update(data) {

    if (this.state.where.length === 0)
      throw new QueryError("Update requires WHERE");

    this.state.data = data;

    const sql =
      SQLCompiler.compileUpdate(this.state);

    const result =
      await this.db.query(sql);

    this.state.reset();

    return result.rowCount;
  }

  // DELETE 
  async delete(soft = false) {

    if (this.state.where.length === 0)
      throw new QueryError("Delete requires WHERE");

    this.state.softDelete = soft;

    const sql =
      SQLCompiler.compileDelete(this.state);

    const result =
      await this.db.query(sql);

    this.state.reset();

    return result.rowCount;
  }
} 
module.exports = QueryHelper;
