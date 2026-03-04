// Import dependencies
const QueryState = require("./QueryState");
const SQLCompiler = require("./SQLCompiler");
const { UnsafeQueryError, ValidationError } = require("./errors");

class QueryHelper {

  constructor(db) {
    this.db = db;                  // PostgreSQL connection pool
    this.state = new QueryState(); // Each query has its own state
  }

  // Choose table

  table(name) {
    this.state.reset();            // Reset previous state
    this.state.table = name;       // Store table name
    return this;                   // Enable chaining
  }


  // Select specific columns

  select(...fields) {
    this.state.select = fields.length ? fields : ["*"];
    return this;
  }

  // WHERE conditions

  where(conditions) {

    // If nothing was passed, throw clean error
    if (!conditions || typeof conditions !== "object") {
      throw new ValidationError("WHERE conditions must be an object");
    }

    Object.entries(conditions).forEach(([field, value]) => {

      // Prevent undefined values
      if (value === undefined || value === null) {
        throw new ValidationError(`WHERE value for ${field} is undefined`);
      }

      this.state.where.push({ field, value });
    });

    return this;
  }

  // LIMIT

  limit(n) {
    this.state.limit = Number(n); // ensure numeric
    return this;
  }

  // OFFSET

  offset(n) {
    this.state.offset = Number(n);
    return this;
  }

  // ORDER BY

  orderBy(field, direction = "ASC") {
    this.state.orderBy = { field, direction };
    return this;
  }

  // GET records

  async get() {

    const { sql, values } =
      SQLCompiler.compileSelect(this.state);

    const result =
      await this.db.query(sql, values);

    this.state.reset(); // important cleanup

    return result.rows;
  }

  // Find by ID

  async findById(id) {
    const results =
      await this.where({ id }).limit(1).get();

    return results[0] || null;
  }

  // Find one

  // async findOne(condition) {
  // const results =
  // await this.where(condition).limit(1).get();

  // return results[0] || null;
  // }

  async findOne(condition) {

    // If a condition is provided, apply it
    if (condition) {
      this.where(condition);
    }

    const results =
      await this.limit(1).get();

    return results[0] || null;
  }

  // CREATE

  async create(data) {

    if (!data || Object.keys(data).length === 0) {
      throw new ValidationError("Insert requires non-empty object");
    }

    this.state.data = data;

    const { sql, values } =
      SQLCompiler.compileInsert(this.state);

    const result =
      await this.db.query(sql, values);

    this.state.reset();

    return result.rows[0];
  }

  // UPDATE

  async update(data) {

    if (this.state.where.length === 0) {
      throw new UnsafeQueryError("Update requires WHERE");
    }

    this.state.data = data;

    const { sql, values } =
      SQLCompiler.compileUpdate(this.state);

    const result =
      await this.db.query(sql, values);

    this.state.reset();

    return result.rowCount;
  }

  // DELETE

  async delete(soft = false) {

    if (this.state.where.length === 0) {
      throw new UnsafeQueryError("Delete requires WHERE");
    }

    this.state.softDelete = soft;

    const { sql, values } =
      SQLCompiler.compileDelete(this.state);

    const result =
      await this.db.query(sql, values);

    this.state.reset();

    return result.rowCount;
  }
}

module.exports = QueryHelper;