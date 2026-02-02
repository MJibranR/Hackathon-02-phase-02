// src/lib/error_handling.ts
// Centralized custom error classes for API responses

export class AuthError extends Error {
    constructor(message = "Authentication required or session expired.") {
        super(message);
        this.name = "AuthError";
    }
}

export class ForbiddenError extends Error {
    constructor(message = "You do not have permission to perform this action.") {
        super(message);
        this.name = "ForbiddenError";
    }
}
