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
