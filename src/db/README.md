# Helper System Documentation

## Overview

The Helper System is a reusable database abstraction layer designed to eliminate repetitive SQL queries across repositories in the Smart Task Manager API.

Instead of writing raw SQL inside each repository file, the project introduces a structured helper layer responsible for building, compiling, and executing database queries dynamically.

This design improves:

* Code reusability
* Maintainability
* Query safety
* Separation of concerns
* Scalability of the database layer

The helper system is used by repositories such as `task.repo.js` and `user.repo.js` to interact with the PostgreSQL database `task_manager_db`.

---

# Project Architecture

The helper system operates within the overall project architecture shown below:

```
src/
├── controllers/      # Handle request and response logic
├── repositories/     # Database logic using QueryHelper
├── db/               # QueryState, QueryHelper, SQLCompiler, errors
├── database/         # Database initialization (initDb.js)
├── routes/           # API route definitions

server.js             # Express server entry point
connection.js

```

The `db/` folder contains the core helper system responsible for query generation and execution.

---

# Request Flow

The following sequence illustrates how a request interacts with the helper system:

```
Client sends HTTP request
        ↓
Route determines controller
        ↓
Controller validates input and calls repository
        ↓
Repository uses QueryHelper
        ↓
QueryHelper builds query using QueryState
        ↓
SQLCompiler generates parameterized SQL
        ↓
PostgreSQL executes query
        ↓
Response returned to client
```

This layered architecture ensures clear separation between HTTP logic, business logic, and database operations.

---

# Core Helper Components

The helper system is composed of three main components:

```
src/db/
├── queryHelper.js
├── queryState.js
├── SQLCompiler.js
├── error.js
```

---

# QueryState

## Description

`QueryState` is responsible for storing the internal state of a database query before it is compiled into SQL.

Instead of passing multiple parameters between functions, the system keeps all query information inside a single structured object.

## Responsibilities

QueryState stores:

* Table name
* WHERE conditions
* Data for INSERT and UPDATE operations
* Ordering rules
* Limit and offset values
* Soft delete configuration

This allows the helper to construct complex queries step by step.

---

# QueryHelper

## Description

`QueryHelper` acts as the main interface between repositories and the database.

Repositories use QueryHelper to perform common database operations without writing SQL manually.

## Supported Operations

* `create()` – Insert a new record
* `find()` – Retrieve multiple records
* `findOne()` – Retrieve a single record
* `where()` – Apply filtering conditions
* `update()` – Modify existing records
* `delete()` – Perform soft deletes

Each method updates the QueryState and then sends the state to the SQLCompiler for SQL generation.

## Example Usage

Example inside a repository:

```javascript
return db
  .table("tasks")
  .where({ id: taskId })
  .findOne();
```

The helper automatically:

1. Stores the query state
2. Compiles SQL
3. Executes the query
4. Returns the result

---

# SQLCompiler

## Description

`SQLCompiler` converts the QueryState object into safe SQL queries.

Instead of concatenating values directly into SQL strings, the compiler generates **parameterized queries**.

## Example Generated Query

```
SELECT * FROM tasks WHERE id = $1;
```

Parameterized queries improve security by preventing SQL injection attacks and improving database performance.

---

# Error Handling

The helper system includes custom error classes to improve debugging and enforce safe database operations.

## ValidationError

Triggered when invalid or incomplete data is passed to a query.

Examples:

* Passing an empty object to `create()`
* Providing invalid conditions to `where()`

## UnsafeQueryError

Triggered when a potentially dangerous query is attempted.

Example:

* Executing `update()` or `delete()` without a `WHERE` condition.

This prevents accidental modification of an entire table.

---

# How the Helper Connects to the Project

The helper system sits between repositories and the PostgreSQL database.

```
Controllers
      ↓
Repositories
      ↓
QueryHelper
      ↓
QueryState
      ↓
SQLCompiler
      ↓
PostgreSQL Database
```

This structure ensures that:

* Controllers handle HTTP request logic
* Repositories manage business rules
* Helpers handle query construction
* SQLCompiler generates SQL statements

---

# Benefits of This Design

Implementing the helper system provides several advantages:

* Eliminates repetitive SQL across repositories
* Makes repositories cleaner and easier to maintain
* Improves query safety through parameterized queries
* Encourages separation of concerns
* Simplifies scaling the database layer as the project grows

---

# Summary

The Helper System serves as a reusable abstraction layer that simplifies database operations while improving safety, maintainability, and code organization. By separating query construction, query state management, and SQL compilation, the project achieves a clean and scalable backend architecture.
