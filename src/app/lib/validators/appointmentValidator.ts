import { z } from "zod";

export const appointmentSchema = z
  .object({
    patientId: z.string().cuid(),
    practitionerId: z.string().cuid(),
    startTime: z.string().datetime(),
    endTime: z.string().datetime(),
    status: z.enum(["PENDING", "CONFIRMED", "CANCELLED"]).optional(),
    patientNote: z.string().optional(),
    practionnerNote: z.string().optional(),
  })
  .refine((data) => new Date(data.endTime) > new Date(data.startTime), {
    path: ["endTime"],
    message: "La date de fin doit être postérieure à la date de début.",
  });
