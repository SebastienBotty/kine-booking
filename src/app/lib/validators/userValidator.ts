import { z } from "zod";

export const userSchema = z.object({
  id: z.string().cuid(),
  name: z.string(),
  email: z.string().email(),
  emailVerified: z.string().datetime().optional().nullable(),
  image: z.string().url().optional().nullable(),
  role: z.enum(["user", "patient", "practitioner", "admin"]),

  accounts: z.array(z.any()).optional(),
  sessions: z.array(z.any()).optional(),
  appointments: z.array(z.any()).optional(),
  availabilities: z.array(z.any()).optional(),
  unavailabilities: z.array(z.any()).optional(),
  practitionerAppointments: z.array(z.any()).optional(),

  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
