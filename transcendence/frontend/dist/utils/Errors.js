// src/errors.ts
export class AppError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
        this.message = message;
    }
}
export class UnauthenticatedError extends AppError {
    constructor(message = "Non authentifié") {
        super(401, message);
    }
}
export class ConflictError extends AppError {
    constructor(message = "Conflit de données") {
        super(409, message);
    }
}
export class ServerError extends AppError {
    constructor(message = "Erreur serveur") {
        super(500, message);
    }
}
