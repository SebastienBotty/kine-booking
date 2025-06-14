import { prisma } from "../prisma/prisma";
import { PostAppointmentType } from "@/types/type";

export async function postAppointment(appointmentData: PostAppointmentType) {
  if (
    appointmentData.createdByRole === "user" &&
    appointmentData.patientId !== appointmentData.creatorId
  ) {
    throw new Error("Un patient  ne peut pas prendre un rdv pour un autre patient");
  }

  try {
    return prisma.appointment.create({
      data: appointmentData,
    });
  } catch (error) {
    console.error("Erreur lors de la création d'un rdv", error);
    throw new Error("Impossible de créer un rdv");
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
