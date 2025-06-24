import { prisma } from "../lib/prisma";

//Get practionners unavailibilities on given date
export const getUnavailabilities = (practitionerId: string, fromDate: Date, toDate: Date) => {
  return prisma.unavailability.findMany({
    where: {
      practitionerId,
      startTime: { lt: toDate },
      endTime: { gt: fromDate },
    },
  });
};
