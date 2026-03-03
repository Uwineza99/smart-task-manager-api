const createDB = require("../db");

// fake db connection example
const dbConnection = {
  query: async (sql) => {
    console.log("Executing:", sql);
    return { rows: [], rowCount: 1 };
  }
};

const db = createDB(dbConnection);

// example query
async function runExamples() {
await db.table("users")
  .select("id", "name")
  .where({ status: "ACTIVE" })
  .limit(10)
  .get();

await db.table("users")
  .create({
    name: "Shamila",
    email: "shamila@gmail.com",
    status: "ACTIVE"
  });

  await db.table("users")
  .where({ id: 1 })
  .delete();
}
runExamples();