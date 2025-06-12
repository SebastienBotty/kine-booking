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
