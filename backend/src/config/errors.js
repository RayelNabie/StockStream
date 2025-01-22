export class ValidationError extends Error {
    constructor(message, details = []) {
      super(message);
      this.name = "ValidationError";
      this.details = details;
    }
  }
  
  export class DatabaseError extends Error {
    constructor(message) {
      super(message);
      this.name = "DatabaseError";
    }
  }