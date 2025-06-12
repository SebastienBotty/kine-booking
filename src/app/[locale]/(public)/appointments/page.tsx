"use client";
import React, { useEffect, useState } from "react";
import styles from "./appointments.module.scss";
import {
  timeToMinutes,
  minutesToTime,
  generateTimeSlots,
  getNextDays,
  generateAvailabilities,
} from "@/app/lib/functions/helpers";
import { AvailabilityType, WeekScheduleInfosType } from "@/types/type";
import { startOfWeek } from "date-fns";

interface Doctor {
  id: string;
  name: string;
  image?: string;
}

interface DayAvailability {
  date: string;
  slots: string[];
}

export default function AppointmentPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctorId, setselectedDoctorId] = useState<string>("");
  const [currentStart, setCurrentStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [availabilities, setAvailabilities] = useState<AvailabilityType[][]>([]);
  const [weekInfos, setWeekInfos] = useState<WeekScheduleInfosType | null>(null);

  useEffect(() => {
    fetch("/api/doctors")
      .then((res) => res.json())
      .then(setDoctors);
  }, []);
  useEffect(() => {
    if (!selectedDoctorId) return;

    const fetchSlots = async () => {
      const startDate = currentStart.toISOString().split("T")[0];
      const endDateObj = new Date(currentStart);
      endDateObj.setDate(currentStart.getDate() + 6); // sur 7 jours
      const endDate = endDateObj.toISOString().split("T")[0];

      try {
        const res = await fetch(`/api/slots?practitionerId=${selectedDoctorId}&start=${startDate}`);
        if (!res.ok) throw new Error("Erreur lors du chargement des créneaux");

        const data: WeekScheduleInfosType = await res.json();
        console.log(data);
        const slots = generateAvailabilities(
          currentStart,
          new Date(endDate),
          data.openings,
          data.blockedSlots
        );
        console.log(slots);
        setAvailabilities(slots);
      } catch (err) {
        console.error(err);
      }
    };

    fetchSlots();
  }, [selectedDoctorId, currentStart]);

  return (
    <div className={styles["appointment-container"]}>
      <h2 className={styles.title}>Prendre rendez-vous</h2>
      <label htmlFor="doctor-select">Choisissez un praticien :</label>
      <select
        id="doctor-select"
        className={styles["doctor-select"]}
        value={selectedDoctorId}
        onChange={(e) => {
          setselectedDoctorId(e.target.value);
          console.log(e.target.value);
        }}
      >
        <option value="">-- Sélectionner --</option>
        {doctors.map((doc) => (
          <option key={doc.id} value={doc.id}>
            {doc.name}
          </option>
        ))}
      </select>

      {selectedDoctorId && (
        <div style={{ marginTop: 32 }}>
          <div className={styles["week-header"]}>
            {" "}
            <button
              aria-label="7 jours précédents"
              className={styles["arrow-btn"]}
              disabled={currentStart.getTime() < new Date().getTime()}
              onClick={() =>
                setCurrentStart((d) => {
                  console.log(currentStart, new Date());
                  console.log("clicked");
                  const prev = new Date(d);
                  prev.setDate(prev.getDate() - 7);
                  return prev;
                })
              }
            >
              ➡️
            </button>
            <span>Semaine du {currentStart.toLocaleDateString()}</span>
            <button
              aria-label="7 jours suivants"
              className={styles["arrow-btn"]}
              onClick={() =>
                setCurrentStart((d) => {
                  const next = new Date(d);
                  console.log(currentStart, next);
                  next.setDate(currentStart.getDate() + 7);
                  return next;
                })
              }
            >
              ➡️
            </button>
          </div>
          <ul className={styles["days-list"]}>
            {availabilities.map((daySlots, index) => (
              <li key={index} className={styles["day-item"]}>
                <strong className={styles["day-label"]}>
                  {daySlots.length > 0
                    ? new Date(daySlots[0].startTime).toLocaleDateString("fr-FR", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      })
                    : new Date(
                        new Date().setDate(
                          new Date().getDate() + ((index - new Date().getDay() + 7) % 7)
                        )
                      ).toLocaleDateString("fr-FR", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      })}
                </strong>
                <div className={styles.slots}>
                  {daySlots.length > 0 ? (
                    daySlots.map((slot) => (
                      <button
                        key={slot.id}
                        className={`${styles["slot-btn"]} ${slot.blocked ? styles["blocked"] : ""}`}
                      >
                        {new Date(slot.startTime).toLocaleTimeString("fr-FR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </button>
                    ))
                  ) : (
                    <span className={styles["no-slot"]}>Aucune disponibilité</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
