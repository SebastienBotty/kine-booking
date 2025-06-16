import { ApiError, AppointmentError, AuthError, ValidationError } from "./index";

export const createApiError = {
  // Erreurs génériques
  validation: (message: string, details?: any) => new ValidationError(message, details),

  unauthorized: (message: string = "Non autorisé") => new AuthError(message, 401, "UNAUTHORIZED"),

  forbidden: (message: string = "Accès refusé") => new AuthError(message, 403, "FORBIDDEN"),

  notFound: (message: string = "Ressource introuvable") => new ApiError(message, 404, "NOT_FOUND"),

  conflict: (message: string = "Conflit") => new ApiError(message, 409, "CONFLICT"),

  internal: (message: string = "Erreur interne du serveur") =>
    new ApiError(message, 500, "INTERNAL_ERROR"),

  // Erreurs spécifiques aux rendez-vous

  appointment: {
    slotTaken: (message: string = "Ce créneau n'est plus disponible") =>
      new AppointmentError(message, 409, "SLOT_ALREADY_TAKEN"),

    unauthorizedPatientBooking: (
      message: string = "Un patient ne peut pas prendre un rendez-vous pour un autre patient"
    ) => new AppointmentError(message, 403, "UNAUTHORIZED_PATIENT_BOOKING"),

    selfAppointment: (
      message: string = "Un praticien ne peut pas prendre un rendez-vous chez lui-même"
    ) => new AppointmentError(message, 400, "SELF_APPOINTMENT_NOT_ALLOWED"),

    practitionerNotFound: (message: string = "Praticien introuvable") =>
      new AppointmentError(message, 404, "PRACTITIONER_NOT_FOUND"),

    patientNotFound: (message: string = "Patient introuvable") =>
      new AppointmentError(message, 404, "PATIENT_NOT_FOUND"),
  },
};
