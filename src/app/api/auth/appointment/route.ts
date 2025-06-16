import { handleApiError } from "@/lib/errors/handler";
import { compose, withAuth } from "@/lib/middlewares";
import { postAppointment } from "@/server/services/appointmentService";
import { AuthenticatedRequest, PostAppointmentType } from "@/types/type";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const postData: PostAppointmentType = await request.json();

    return compose(withAuth)(request, async (req: AuthenticatedRequest) => {
      try {
        const user = req.user;
        const appointment = await postAppointment(postData, user);

        return NextResponse.json({
          success: true,
          data: appointment,
        });
      } catch (error) {
        return handleApiError(error);
      }
    });
  } catch (error) {
    return handleApiError(error);
  }
}
