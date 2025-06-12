import { WeekScheduleInfosType } from "@/types/type";
import { generateAvailabilities } from "../lib/functions/helpers"; // Si tu as cette fonction dans utils

export async function fetchSlots(practitionerId: string, currentStart: Date) {
  const startDate = currentStart.toISOString().split("T")[0];
  const endDateObj = new Date(currentStart);
  endDateObj.setDate(currentStart.getDate() + 6); // sur 7 jours
  const endDate = endDateObj.toISOString().split("T")[0];

  const res = await fetch(`/api/slots?practitionerId=${practitionerId}&start=${startDate}`);

  if (!res.ok) {
    throw new Error("Erreur lors du chargement des créneaux");
  }

  const data: WeekScheduleInfosType = await res.json();

  const slots = generateAvailabilities(
    currentStart,
    new Date(endDate),
    data.openings,
    data.blockedSlots
  );

  return slots;
}
