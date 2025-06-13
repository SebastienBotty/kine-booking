import { compose, withAdminAuth, withAuth, withPractitionerAuth } from "@/lib/middlewares";
import { prisma } from "@/server/prisma/prisma";
import { getAllPractitioners } from "@/server/services/userService";
import { Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  return compose(withAuth)(request, getAllPractitioners);
}
