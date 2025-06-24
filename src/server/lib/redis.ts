import { getMondayAt5AM } from "@/lib/functions/helpers";
import Redis from "ioredis";

export const redis = new Redis(process.env.REDIS_URL!);

export async function invalidateAppointmentWeekCache(practitionerId: string, date: Date) {
  const start = getMondayAt5AM(date);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  const key = `rdvs:${practitionerId}:${start.toISOString()}:${end.toISOString()}`;
  await redis.del(key);
}
