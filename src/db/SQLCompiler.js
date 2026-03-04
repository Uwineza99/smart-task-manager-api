// Responsible ONLY for building SQL queries
// No database execution happens here
// This version uses PARAMETERIZED queries for security

class SQLCompiler {

  // SELECT

  static compileSelect(state) {

    // Array that will store parameter values ($1, $2, etc.)
    const values = [];

    if (!state.table) {
      throw new Error("No table selected");
    }
    // Start building SELECT query
    let sql = `SELECT ${state.select.join(", ")} FROM ${state.table}`;

    // If WHERE conditions exist
    if (state.where.length > 0) {

      // Convert conditions into parameterized format
      const conditions = state.where.map((cond, index) => {

        // Push actual value into values array
        values.push(cond.value);

        // Return SQL condition using placeholder
        return `${cond.field} = $${index + 1}`;
      });

      // Add WHERE clause
      sql += ` WHERE ${conditions.join(" AND ")}`;
    }

    // Add ORDER BY if provided
    if (state.orderBy) {
      sql += ` ORDER BY ${state.orderBy.field} ${state.orderBy.direction}`;
    }

    // Add LIMIT (safe because it's number, not user string)
    if (state.limit !== null) {
      sql += ` LIMIT ${state.limit}`;
    }

    // Add OFFSET
    if (state.offset !== null) {
      sql += ` OFFSET ${state.offset}`;
    }

    // Return SQL + values separately
    return { sql, values };
  }

  // INSERT

  static compileInsert(state) {

    // Extract column names
    const columns = Object.keys(state.data);

    // Extract column values
    const values = Object.values(state.data);

    // Create placeholders like $1, $2, $3
    const placeholders = values.map((_, index) => `$${index + 1}`);

    // Build final query
    const sql = `
      INSERT INTO ${state.table}
      (${columns.join(", ")})
      VALUES (${placeholders.join(", ")})
      RETURNING *
    `;

    return { sql, values };
  }

  // UPDATE
  static compileUpdate(state) {

    const values = [];

    // Build SET clause with parameter placeholders
    const setClause = Object.entries(state.data)
      .map(([column, value], index) => {

        // Push value into array
        values.push(value);

        // Return parameterized column update
        return `${column} = $${index + 1}`;
      })
      .join(", ");

    // Build WHERE clause
    const whereClause = state.where
      .map((condition, index) => {

        // Push WHERE value into array
        values.push(condition.value);

        // Position continues after SET values
        return `${condition.field} = $${Object.keys(state.data).length + index + 1}`;
      })
      .join(" AND ");

    const sql = `
      UPDATE ${state.table}
      SET ${setClause}
      WHERE ${whereClause}
    `;

    return { sql, values };
  }

  // DELETE
  static compileDelete(state) {

    if (state.where.length === 0) {
      throw new Error("DELETE requires WHERE condition");
    }

    const values = [];

    // Build WHERE clause
    const conditions = state.where
      .map((condition, index) => {

        values.push(condition.value);

        return `${condition.field} = $${index + 1}`;
      })
      .join(" AND ");

    // Soft delete support
    if (state.softDelete) {

      const sql = `
        UPDATE ${state.table}
        SET deleted_at = CURRENT_TIMESTAMP
        WHERE ${conditions}
      `;

      return { sql, values };
    }

    // Hard delete
    const sql = `
      DELETE FROM ${state.table}
      WHERE ${conditions}
    `;

    return { sql, values };
  }
}

module.exports = SQLCompiler;