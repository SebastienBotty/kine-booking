import { WeekScheduleInfosType } from "@/types/type";

export async function fetchSlots(practitionerId: string, currentStart: Date) {
  const localDate = new Date(currentStart.getTime() - currentStart.getTimezoneOffset() * 60000);
  const startDate = localDate.toISOString().split("T")[0];

  const res = await fetch(`/api/slots?practitionerId=${practitionerId}&start=${startDate}`);

  if (!res.ok) {
    throw new Error("Erreur lors du chargement des créneaux");
  }

  const data: WeekScheduleInfosType = await res.json();
  return data;
}
