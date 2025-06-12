import { useEffect, useState } from "react";
import { fetchSlots } from "@/api/appointmentApi";
import { AvailabilityType } from "@/types/type";
import { generateAvailabilities } from "@/lib/functions/helpers";

export function useSlots(practitionerId: string | null, currentStart: Date) {
  const [availabilities, setAvailabilities] = useState<AvailabilityType[][]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const endDateObj = new Date(currentStart);
    endDateObj.setDate(currentStart.getDate() + 6); // sur 7 jours
    const endDate = endDateObj.toISOString().split("T")[0];
    if (!practitionerId) {
      setAvailabilities([]);
      return;
    }

    setLoading(true);
    setError(null);

    fetchSlots(practitionerId, currentStart)
      .then((slots) => {
        const genSlots = generateAvailabilities(
          currentStart,
          new Date(endDate),
          slots.openings,
          slots.blockedSlots
        );
        setAvailabilities(genSlots);
      })
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [practitionerId, currentStart]);

  return { availabilities, loading, error };
}
