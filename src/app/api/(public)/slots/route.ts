// app/api/slots/route.ts
import { NextResponse } from "next/server";
import { endOfWeek, startOfWeek } from "date-fns";
import { WeekScheduleInfosType } from "@/types/type";
import { getAppointments } from "@/server/services/appointmentService";
import { getUnavailabilities } from "@/server/services/unavailabilityService";
import { getAvailabilities } from "@/server/services/availabilityService";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const practitionerId = searchParams.get("practitionerId");
  const from = searchParams.get("start");

  if (!practitionerId || !from) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  const fromDate = startOfWeek(new Date(from), { weekStartsOn: 1 }); // lundi
  const toDate = endOfWeek(new Date(from), { weekStartsOn: 1 }); // dimanche

  const [availabilities, unavailabilities, appointments] = await Promise.all([
    getAvailabilities(practitionerId),
    getUnavailabilities(practitionerId, fromDate, toDate),
    getAppointments(practitionerId, fromDate, toDate),
  ]);
  console.log({ availabilities, unavailabilities, appointments });
  const weekInfos: WeekScheduleInfosType = {
    openings: Array.from({ length: 7 }, () => ({ startTime: 0, endTime: 0 })),
    blockedSlots: [],
  };

  for (const day of availabilities) {
    let targetDay = weekInfos.openings[day.dayOfWeek];
    targetDay.startTime = day.startTime;
    targetDay.endTime = day.endTime;
  }

  for (const appointment of appointments) {
    weekInfos.blockedSlots.push({
      startTime: appointment.startTime,
      endTime: appointment.endTime,
      type: "Appointment",
    });
  }
  for (const unavailability of unavailabilities) {
    weekInfos.blockedSlots.push({
      startTime: unavailability.startTime,
      endTime: unavailability.endTime,
      type: "Unavailability",
    });
  }
  return NextResponse.json(weekInfos);
}
