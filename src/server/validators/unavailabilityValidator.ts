import { z } from "zod";

export const unavailabilitySchema = z
  .object({
    id: z.string().uuid().optional(), // optionnel à la création
    practitionerId: z.string().cuid(),
    startTime: z.string().datetime(),
    endTime: z.string().datetime(),
    reason: z.string(),
    createdAt: z.string().datetime().optional(),
  })
  .refine((data) => new Date(data.endTime) > new Date(data.startTime), {
    path: ["endTime"],
    message: "La date de fin doit être postérieure à la date de début.",
  });
