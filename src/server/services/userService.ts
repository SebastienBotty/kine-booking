import { Role } from "@prisma/client";
import { prisma } from "../prisma/prisma";

export const getAllPractitioners = async () => {
  const pract = await prisma.user.findMany({
    where: {
      role: {
        in: [Role.admin, Role.practitioner],
      },
    },
    select: {
      id: true,
      name: true,
      image: true,
    },
  });
  return Response.json(pract);
};
