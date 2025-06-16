import NextAuth from "next-auth";
import { User, Role } from "@prisma/client";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: User;
  }
}

declare module "next-auth/jwt" {
  type JWT = User;
}

export type PostAppointmentType = {
  practitionerId: string;
  patientId: string;
  startTime: Date;
  endTime: Date;
  status: AppointmentStatus;
  patientNote: string | undefined;
  practionnerNote: string | undefined;
  creatorId: string;
  createdByRole: Role;
  cancelledByRole: Role?;
};
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

export interface AuthenticatedRequest extends Request {
  user?: User;
  validatedData?: any;
}

export type MiddlewareHandler = (req: AuthenticatedRequest) => Promise<Response>;
export type Middleware = (request: Request, handler: MiddlewareHandler) => Promise<Response>;
