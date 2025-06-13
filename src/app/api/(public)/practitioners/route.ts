import { compose } from "@/lib/middlewares";
import { getAllPractitioners } from "@/server/services/userService";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  return compose()(request, getAllPractitioners);
}
