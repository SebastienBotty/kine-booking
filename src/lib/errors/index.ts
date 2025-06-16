export class ApiError extends Error {
  public statusCode: number;
  public code: string;
  public details?: any;

  constructor(message: string, statusCode: number, code: string, details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.name = "ApiError";

    // Nécessaire pour que instanceof fonctionne correctement
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

// Classes spécialisées pour différents domaines
export class AppointmentError extends ApiError {
  constructor(message: string, statusCode: number, code: string, details?: any) {
    super(message, statusCode, code, details);
    this.name = "AppointmentError";
  }
}

export class AuthError extends ApiError {
  constructor(message: string, statusCode: number, code: string, details?: any) {
    super(message, statusCode, code, details);
    this.name = "AuthError";
  }
}

export class ValidationError extends ApiError {
  constructor(message: string, details?: any) {
    super(message, 400, "VALIDATION_ERROR", details);
    this.name = "ValidationError";
  }
}
