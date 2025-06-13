import { AppointmentStatus } from "@prisma/client";
import { prisma } from "../prisma/prisma";

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

export async function createAppointment(data: {
  practitionerId: string;
  patientId: string;
  startTime: Date;
  endTime: Date;
  status: AppointmentStatus;
  patientNote: string | undefined;
  practionnerNote: string | undefined;
}) {
  return prisma.appointment.create({
    data,
  });
}
