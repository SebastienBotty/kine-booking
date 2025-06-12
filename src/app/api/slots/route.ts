// app/api/slots/route.ts
import { prisma } from "@/app/lib/prisma/prisma";
import { NextResponse } from "next/server";
import {
  addDays,
  addMinutes,
  endOfWeek,
  isBefore,
  isEqual,
  startOfWeek,
  startOfDay,
} from "date-fns";
import { convertDecimalHourToTime } from "@/app/lib/functions/helpers";
import { WeekScheduleInfosType } from "@/types/type";

const SLOT_DURATION = 30; // minutes

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const practitionerId = searchParams.get("practitionerId");
  const from = searchParams.get("start");

  if (!practitionerId || !from) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  const fromDate = startOfWeek(new Date(from), { weekStartsOn: 1 }); // lundi
  const toDate = endOfWeek(new Date(from), { weekStartsOn: 1 }); // dimanche

  console.log(fromDate);
  console.log(toDate);

  const [availabilities, unavailabilities, appointments] = await Promise.all([
    prisma.availability.findMany({ where: { practitionerId } }),
    prisma.unavailability.findMany({
      where: {
        practitionerId,
        startTime: { lt: toDate },
        endTime: { gt: fromDate },
      },
    }),
    prisma.appointment.findMany({
      where: {
        practitionerId: practitionerId,
        status: { not: "CANCELLED" },
        startTime: { lt: toDate },
        endTime: { gt: fromDate },
      },
    }),
  ]);
  console.log({ availabilities, unavailabilities, appointments });
  const weekInfos: WeekScheduleInfosType = {
    openings: Array.from({ length: 7 }, () => ({ startTime: 0, endTime: 0 })),
    blockedSlots: [],
  };
  console.log(weekInfos);

  console.log("5555555555555555555555555555555555555555555555");
  for (const day of availabilities) {
    console.log(day);

    let targetDay = weekInfos.openings[day.dayOfWeek];
    targetDay.startTime = day.startTime;
    targetDay.endTime = day.endTime;
    console.log(weekInfos);
    console.log;
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

  /* for (let day = startOfDay(fromDate); isBefore(day, toDate); day = addDays(day, 1)) {
    const dayOfWeek = day.getDay();
    const todaysAvailabilities = availabilities.filter((a) => a.dayOfWeek === dayOfWeek);

    for (const availability of todaysAvailabilities) {
      const start = new Date(day);
      const convertedStart = convertDecimalHourToTime(availability.startTime);
      start.setHours(convertedStart.hours, convertedStart.min, 0, 0);

      const end = new Date(day);
      const convertedEnd = convertDecimalHourToTime(availability.endTime);

      end.setHours(convertedEnd.hours, convertedEnd.min, 0, 0);

      let current = new Date(start);

      while (
        isBefore(addMinutes(current, SLOT_DURATION), end) ||
        isEqual(addMinutes(current, SLOT_DURATION), end)
      ) {
        const slotStart = new Date(current);
        const slotEnd = addMinutes(current, SLOT_DURATION);

        const overlaps = (startA: Date, endA: Date, startB: Date, endB: Date) =>
          startA < endB && startB < endA;

        const isBlocked =
          appointments.some((a) => overlaps(slotStart, slotEnd, a.startTime, a.endTime)) ||
          unavailabilities.some((u) => overlaps(slotStart, slotEnd, u.startTime, u.endTime));

        if (!isBlocked) {
          slots.push({ start: slotStart, end: slotEnd });
        }

        current = slotEnd;
      }
    }
  } */

  return NextResponse.json(weekInfos);
}
