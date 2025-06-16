import {
  AvailabilityType,
  BlockedSlotsType,
  SlotsDecimalType,
  SlotsType,
  WeekScheduleInfosType,
} from "@/types/type";

// Convertit une heure en format "HH:mm" en minutes depuis minuit
export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

// Convertit des minutes depuis minuit en format "HH:mm"
export function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
}

// Génère des créneaux de 30 minutes entre startTime et endTime
export function generateTimeSlots(startTime: string, endTime: string): string[] {
  const startMinutes = timeToMinutes(startTime);
  const endMinutes = timeToMinutes(endTime);
  const slots: string[] = [];

  for (let time = startMinutes; time < endMinutes; time += 30) {
    slots.push(minutesToTime(time));
  }

  return slots;
}

export function getNextDays(start: Date, count: number) {
  const days = [];
  for (let i = 0; i < count; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    days.push(d);
  }
  return days;
}

export function convertDecimalHourToTime(timeNumber: number) {
  const hours = Math.floor(timeNumber);
  const min = timeNumber % 1 === 0.5 ? 30 : 0;
  return { hours, min };
}

export function generateAvailabilities(
  startDate: Date,
  endDate: Date,
  openings: WeekScheduleInfosType["openings"],
  blockedSlots: WeekScheduleInfosType["blockedSlots"]
): AvailabilityType[][] {
  const weeklySlots: AvailabilityType[][] = Array.from({ length: 7 }, () => []);
  const slotDuration = 30 * 60 * 1000;

  endDate.setHours(23, 0);

  const blockedRanges = blockedSlots.map((slot) => ({
    start: new Date(slot.startTime).getTime(),
    end: new Date(slot.endTime).getTime(),
  }));

  for (
    let current = new Date(startDate);
    current <= endDate;
    current.setDate(current.getDate() + 1)
  ) {
    const now = new Date();

    const dayOfWeek = current.getDay();
    const opening = openings[dayOfWeek];

    const baseDate = new Date(current);
    baseDate.setSeconds(0);
    baseDate.setMilliseconds(0);

    const dayStart = new Date(baseDate);
    dayStart.setHours(8, 0); // 8h00

    const dayEnd = new Date(baseDate);
    dayEnd.setHours(21, 0); // 21h00

    const openingStart = new Date(baseDate);
    openingStart.setHours(Math.floor(opening.startTime), (opening.startTime % 1) * 60);

    const openingEnd = new Date(baseDate);
    openingEnd.setHours(Math.floor(opening.endTime), (opening.endTime % 1) * 60);

    for (
      let slot = new Date(dayStart);
      slot < dayEnd;
      slot = new Date(slot.getTime() + slotDuration)
    ) {
      const slotEnd = new Date(slot.getTime() + slotDuration);

      const overlapsBlocked = blockedRanges.some(
        (blocked) => slot.getTime() < blocked.end && slotEnd.getTime() > blocked.start
      );

      const insideOpening =
        opening.startTime !== 0 &&
        opening.endTime !== 0 &&
        slot >= openingStart &&
        slotEnd <= openingEnd;

      const isPassed = slot.getTime() <= now.getTime();

      weeklySlots[dayOfWeek].push({
        id: `${slot.getTime()}`,
        dayOfWeek,
        startTime: slot.toISOString(),
        endTime: slotEnd.toISOString(),
        blocked: overlapsBlocked || !insideOpening || isPassed,
      });
    }
  }

  return weeklySlots;
}

export function getMondayAt5AM(date?: Date): Date {
  const targetDate = date || new Date();

  // Obtenir le jour de la semaine (0 = dimanche, 1 = lundi, etc.)
  const dayOfWeek = targetDate.getDay();

  // Calculer combien de jours il faut reculer pour arriver au lundi
  // Si c'est dimanche (0), on recule de 6 jours
  // Si c'est lundi (1), on recule de 0 jour
  // Si c'est mardi (2), on recule de 1 jour, etc.
  const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  // Créer une nouvelle date pour le lundi
  const monday = new Date(targetDate);
  monday.setDate(targetDate.getDate() - daysToSubtract);

  // Définir l'heure à 5h00 du matin
  monday.setHours(5, 0, 0, 0);

  return monday;
}
