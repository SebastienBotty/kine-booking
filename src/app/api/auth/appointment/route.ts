import { compose, withAuth } from "@/lib/middlewares";
import { postAppointment } from "@/server/services/appointmentService";
import { AuthenticatedRequest, PostAppointmentType } from "@/types/type";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const postData: PostAppointmentType = await request.json();

  return compose(withAuth)(request, async (req: AuthenticatedRequest) => {
    const user = req.user;
    const appointment = await postAppointment(postData, user);
    return new Response(JSON.stringify(appointment), { status: 200 });
  });
}
