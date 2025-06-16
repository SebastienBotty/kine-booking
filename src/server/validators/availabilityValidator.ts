import { z } from "zod";

export const availabilitySchema = z.object({
  practitionerId: z.string().cuid(),
  dayOfWeek: z.number().min(0).max(6),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
});
