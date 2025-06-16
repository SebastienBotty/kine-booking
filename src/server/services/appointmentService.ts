import { AppointmentStatus } from "@prisma/client";
import { prisma } from "../prisma/prisma";
import { AuthenticatedRequest, PostAppointmentType } from "@/types/type";
import { appointmentSchema } from "../validators/appointmentValidator";
import { ZodError } from "zod";
import { cleanHtml } from "../lib/helper";

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
    if (
      validatedData.createdByRole === "user" &&
      validatedData.patientId !== appointmentData.creatorId
    ) {
      throw new Error("Un patient  ne peut pas prendre un rdv pour un autre patient");
    }
    if (validatedData.practitionerId === validatedData.patientId)
      throw new Error("Un practitien  ne peut pas prendre un rdv cez lui-même");

    const existing = await prisma.appointment.findFirst({
      where: {
        startTime: validatedData.startTime,
        practitionerId: validatedData.practitionerId,
        status: "PENDING",
      },
    });

    if (existing) {
      throw new Error("Ce rendez-vous est déja pris.");
    }
    return prisma.appointment.create({
      data: validatedData,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      console.error("Validation Zod échouée :", error.errors);
      throw new Error("Données de rendez-vous invalides");
    } else if (error instanceof Error) {
      console.error("Erreur lors de la création d'un rdv", error);
      throw new Error("Impossible de créer un rdv:" + error.message);
    } else {
      console.error("Erreur lors de la création d'un rdv", error);
      throw new Error("Unknown errror");
    }
  }
}

export const getAppointments = (practitionerId: string, fromDate: Date, toDate: Date) => {
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
