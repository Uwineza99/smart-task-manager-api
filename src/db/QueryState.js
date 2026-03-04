// QueryState stores information about ONE query

class QueryState {

  constructor() {

    // table name being queried
    this.table = null;

    // selected columns (default = all)
    this.select = ["*"];

    // where conditions list
    this.where = [];
    // limit number
    this.limit = null;

    // offset number
    this.offset = null;

    // ordering configuration
    this.order = null;

    //ordering depending on the field you want
    this.orderByFields = null;

    // data used for create/update
    this.data = {};

    // soft delete flag
    this.softDelete = false;
    
    // Holds parameterized values
    this.params = [];
  }

  // Reset query after execution
  reset() {

    // clear table
    this.table = null;

    // reset select fields
    this.select = ["*"];

    // remove conditions
    this.where = [];
    this.limit = null;
    this.offset = null;
    this.order = null;
    this.orderByFields = null;
    this.data = {};
    this.softDelete = false;
    this.params = [];
  }
}

// export class
module.exports = QueryState;