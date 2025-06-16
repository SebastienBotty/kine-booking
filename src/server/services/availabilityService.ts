import { prisma } from "../prisma/prisma";

export const getAvailabilities = (practitionerId: string) => {
  return prisma.availability.findMany({ where: { practitionerId } });
};
