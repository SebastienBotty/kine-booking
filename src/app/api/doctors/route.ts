import { prisma } from "@/app/lib/prisma/prisma";
import { Role } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
  const doctors = await prisma.user.findMany({
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

  return NextResponse.json(doctors);
}
