import NextAuth from "next-auth";
import { User } from "@prisma/client";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: User;
  }
}

declare module "next-auth/jwt" {
  type JWT = User;
}

export type AvailabilityType = {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  blocked: boolean;
};

export type BlockedSlotsType = SlotsType & {
  type: "Appointment" | "Unavailability";
};

export type Doctor = {
  id: string;
  name: string;
  image?: string;
};
export type LanguageType = "FR" | "EN" | "NL";

export type SlotsType = {
  startTime: Date;
  endTime: Date;
};
export type SlotsDecimalType = {
  startTime: number;
  endTime: number;
};

export type WeekDayType = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type WeekScheduleInfosType = {
  openings: SlotsDecimalType[];
  blockedSlots: BlockedSlotsType[];
};
