import { prisma } from "../lib/prisma";

export const getAvailabilities = (practitionerId: string) => {
  return prisma.availability.findMany({ where: { practitionerId } });
};
