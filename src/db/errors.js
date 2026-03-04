// Custom error for unsafe operations
// When updating without where() it reurns error
class UnsafeQueryError extends Error {
  constructor(message) {
    super(message);

    // helps identify error type
    this.name = "UnsafeQueryError";
    this.statusCode = 400;
  }
}

// When user sends empty object to create()
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}

module.exports = {
  UnsafeQueryError,
  ValidationError,
};