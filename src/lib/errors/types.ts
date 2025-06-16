export interface ApiErrorResponse {
  success: false;
  error: {
    message: string;
    code: string;
    details?: any;
  };
}

export interface ApiError extends ApiErrorResponse {}

export interface ApiSuccessResponse<T = any> {
  success: true;
  data: T;
}

export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

// Codes d'erreur constants
export const ERROR_CODES = {
  // Génériques
  VALIDATION_ERROR: "VALIDATION_ERROR",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  CONFLICT: "CONFLICT",
  INTERNAL_ERROR: "INTERNAL_ERROR",

  // Rendez-vous
  SLOT_ALREADY_TAKEN: "SLOT_ALREADY_TAKEN",
  UNAUTHORIZED_PATIENT_BOOKING: "UNAUTHORIZED_PATIENT_BOOKING",
  SELF_APPOINTMENT_NOT_ALLOWED: "SELF_APPOINTMENT_NOT_ALLOWED",
  PRACTITIONER_NOT_FOUND: "PRACTITIONER_NOT_FOUND",
  PATIENT_NOT_FOUND: "PATIENT_NOT_FOUND",

  // Auth
  INVALID_TOKEN: "INVALID_TOKEN",
  TOKEN_EXPIRED: "TOKEN_EXPIRED",
  INSUFFICIENT_PERMISSIONS: "INSUFFICIENT_PERMISSIONS",
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];
