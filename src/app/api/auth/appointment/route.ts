import { compose, withAuth } from "@/lib/middlewares";
import { postAppointment } from "@/server/services/appointmentService";
import { PostAppointmentType } from "@/types/type";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const postData: PostAppointmentType = await request.json();

  return compose(withAuth)(request, async (req) => {
    const appointment = await postAppointment(postData);
    return Response.json(appointment);
  });
}
