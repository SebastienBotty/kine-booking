import { AppointmentStatus } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { invalidateAppointmentWeekCache, redis } from "../lib/redis";
import { AuthenticatedRequest, PostAppointmentType } from "@/types/type";
import { appointmentSchema } from "../validators/appointmentValidator";
import { ZodError } from "zod";
import { cleanHtml } from "../lib/helper";
import { ApiError } from "@/lib/errors";
import { createApiError } from "@/lib/errors/factories";

export async function postAppointment(
  appointmentData: PostAppointmentType,
  user: AuthenticatedRequest["user"]
) {
  try {
    const validatedData = appointmentSchema.parse({
      ...appointmentData,
      status: appointmentData.status ?? "PENDING",
      patientNote: cleanHtml(appointmentData.patientNote),
      practionnerNote: cleanHtml(appointmentData.practionnerNote),
      createdByRole: user?.role ?? appointmentData.createdByRole,
      cancelledByRole: appointmentData.cancelledByRole ?? undefined,
    });

    // Validations métier avec factory functions
    if (
      validatedData.createdByRole === "user" &&
      validatedData.patientId !== appointmentData.creatorId
    ) {
      throw createApiError.appointment.unauthorizedPatientBooking();
    }

    if (validatedData.practitionerId === validatedData.patientId) {
      throw createApiError.appointment.selfAppointment();
    }

    const existing = await prisma.appointment.findFirst({
      where: {
        startTime: validatedData.startTime,
        practitionerId: validatedData.practitionerId,
        status: "PENDING",
      },
    });

    if (existing) {
      throw createApiError.appointment.slotTaken();
    }

    const newAppointment = await prisma.appointment.create({
      data: validatedData,
    });

    invalidateAppointmentWeekCache(newAppointment.practitionerId, newAppointment.startTime);
    return newAppointment;
  } catch (error) {
    // Re-lancer les erreurs personnalisées et Zod
    if (error instanceof ApiError || error instanceof ZodError) {
      throw error;
    }

    // Gestion des erreurs Prisma
    if (error instanceof Error) {
      if (error.message.includes("Foreign key")) {
        if (error.message.includes("practitioner")) {
          throw createApiError.appointment.practitionerNotFound();
        }
        if (error.message.includes("patient")) {
          throw createApiError.appointment.patientNotFound();
        }
        throw createApiError.notFound("Référence invalide");
      }

      if (error.message.includes("Unique constraint")) {
        throw createApiError.conflict("Ce rendez-vous existe déjà");
      }
    }

    console.error("Erreur inattendue:", error);
    throw createApiError.internal();
  }
}

export const getAppointments = async (practitionerId: string, fromDate: Date, toDate: Date) => {
  const from = new Date(fromDate).toISOString();
  const to = new Date(toDate).toISOString();

  const cacheKey = `rdvs:${practitionerId}:${from}:${to}`;
  const cached = await redis.get(cacheKey);

  if (cached) {
    console.log(cached);
    return JSON.parse(cached);
  }

  return prisma.appointment.findMany({
    where: {
      practitionerId: practitionerId,
      status: { not: "CANCELLED" },
      startTime: { lt: toDate },
      endTime: { gt: fromDate },
    },
  });
};

export async function findConflictingAppointment({
  practitionerId,
  startTime,
  endTime,
}: {
  practitionerId: string;
  startTime: Date;
  endTime: Date;
}) {
  return prisma.appointment.findFirst({
    where: {
      practitionerId,
      status: { not: "CANCELLED" },
      AND: [{ startTime: { lt: endTime } }, { endTime: { gt: startTime } }],
    },
  });
}
