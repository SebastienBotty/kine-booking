import { ApiError } from "@/lib/errors";
import { ApiResponse } from "@/lib/errors/types";
import { WeekScheduleInfosType } from "@/types/type";

export async function fetchSlots(practitionerId: string, currentStart: Date) {
  const localDate = new Date(currentStart.getTime() - currentStart.getTimezoneOffset() * 60000);
  const startDate = localDate.toISOString().split("T")[0];

  try {
  } catch (error) {}
  const res = await fetch(`/api/slots?practitionerId=${practitionerId}&start=${startDate}`);

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Erreur inconnue");
  }

  const data: WeekScheduleInfosType = await res.json();
  return data;
}

export const postAppointment = async (data: {
  practitionerId: string;
  patientId: string;
  creatorId: string;
  startTime: Date;
  endTime: Date;
  patientNote?: string;
}) => {
  const res = await fetch("/api/auth/appointment", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const jsonData: ApiResponse = await res.json();

  // Vérifier si la réponse indique un succès
  if (!jsonData.success) {
    // Lancer une erreur avec toutes les informations
    throw new ApiError(
      jsonData.error.message,
      res.status,
      jsonData.error.code,
      jsonData.error.details
    );
  }

  return jsonData.data;
};
