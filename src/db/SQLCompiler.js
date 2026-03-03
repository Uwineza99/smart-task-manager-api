// Responsible ONLY for building SQL queries
// No database execution happens here

class SQLCompiler {
  // SELECT
  static compileSelect(state) {
    // build SELECT clause
    let sql = `SELECT ${state.select.join(",")} FROM ${state.table}`;

    // add WHERE conditions if they exist
    if (state.where.length > 0) {
      // convert conditions into SQL format
      const conditions = state.where
   
      .map((cond) => `${cond.field} = ${cond.value}`)
        .join(" AND ");
      sql += ` WHERE ${conditions}`;
    }

    // Add ORDER BY if provided
    if (state.orderBy) {
      sql += ` ORDER BY ${state.orderBy.field} ${state.orderBy.direction}`;
    }

    // Add LIMIT
    if (state.limit !== null) {
      sql += ` LIMIT ${state.limit}`;
    }

    // Add OFFSET
    if (state.offset !== null) {
      sql += ` OFFSET ${state.offset}`;
    }

    // Return final SQL query
    return sql;
  }
   // INSERT 
  static compileInsert(state) {

    // extract column names
    const columnNames =
      Object.keys(state.data).join(", ");

    // extract values
    const columnValues =
      Object.values(state.data)
        .map(value => `'${value}'`)
        .join(", ");

    return `INSERT INTO ${state.table}
            (${columnNames})
            VALUES (${columnValues})
            RETURNING *`;
  }

  // UPDATE 
  static compileUpdate(state) {

    // build SET clause
    const updateFields =
      Object.entries(state.data)
        .map(([columnName, columnValue]) =>
          `${columnName}='${columnValue}'`
        )
        .join(", ");

    // build WHERE clause
    const conditions =
      state.where
        .map(condition =>
          `${condition.fieldName}='${condition.fieldValue}'`
        )
        .join(" AND ");

    return `UPDATE ${state.table}
            SET ${updateFields}
            WHERE ${conditions}`;
  }

  // DELETE 
static compileDelete(state) {

  const conditions = state.where
    .map(condition => {

      const value =
        typeof condition.value === "string"
          ? `'${condition.value}'`
          : condition.value;

      return `${condition.field}=${value}`;
    })
    .join(" AND ");
  
  if (!conditions) {
    throw new Error("DELETE requires WHERE condition");
  }
    // soft delete support
    if (state.softdelete){

      return `UPDATE ${state.table}
              SET deleted_at = CURRENT_TIMESTAMP
              WHERE ${conditions}`;
    }

    return `DELETE FROM ${state.table}
            WHERE ${conditions}`;
  }
}

module.exports = SQLCompiler;
