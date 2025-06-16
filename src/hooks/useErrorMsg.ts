import { useTranslations } from "next-intl";
import { ApiError } from "@/lib/errors";

// Hook pour récupérer les messages d'erreur traduits
export const useErrorMessages = () => {
  const t = useTranslations("errors");

  const getErrorMessage = (error: ApiError | Error): string => {
    if (!(error instanceof ApiError)) {
      // Erreur réseau ou autre
      if (typeof navigator !== "undefined" && !navigator.onLine) {
        return t("network.offline");
      }
      return t("network.unexpected");
    }

    // Messages personnalisés selon le code d'erreur
    switch (error.code) {
      case "SLOT_ALREADY_TAKEN":
        return t("appointment.slot_already_taken");

      case "UNAUTHORIZED_PATIENT_BOOKING":
        return t("appointment.unauthorized_patient_booking");

      case "SELF_APPOINTMENT_NOT_ALLOWED":
        return t("appointment.self_appointment_not_allowed");

      case "VALIDATION_ERROR":
        return t("validation.invalid_data");

      case "PRACTITIONER_NOT_FOUND":
        return t("appointment.practitioner_not_found");

      case "PATIENT_NOT_FOUND":
        return t("appointment.patient_not_found");

      case "UNAUTHORIZED":
        return t("auth.unauthorized");

      case "FORBIDDEN":
        return t("auth.forbidden");

      case "INTERNAL_ERROR":
        return t("server.internal_error");

      default:
        return error.message || t("generic");
    }
  };

  return { getErrorMessage };
};
