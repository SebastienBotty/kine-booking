import { useEffect, useState } from "react";
import { fetchSlots } from "@/api/appointmentApi";
import { AvailabilityType } from "@/types/type";

export function useSlots(practitionerId: string | null, currentStart: Date) {
  const [availabilities, setAvailabilities] = useState<AvailabilityType[][]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!practitionerId) {
      setAvailabilities([]);
      return;
    }

    setLoading(true);
    setError(null);

    fetchSlots(practitionerId, currentStart)
      .then((slots) => setAvailabilities(slots))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [practitionerId, currentStart]);

  return { availabilities, loading, error };
}
