"use client";
import React, { useEffect, useState } from "react";
import styles from "./appointments.module.scss";
import {
  timeToMinutes,
  minutesToTime,
  generateTimeSlots,
  getNextDays,
} from "@/app/lib/functions/helpers";
import { WeekScheduleInfosType } from "@/types/type";

interface Doctor {
  id: string;
  name: string;
  image?: string;
}

interface Availability {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

interface DayAvailability {
  date: string;
  slots: string[];
}

export default function AppointmentPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctorId, setselectedDoctorId] = useState<string>("");
  const [currentStart, setCurrentStart] = useState(new Date());
  const [availabilities, setAvailabilities] = useState<DayAvailability[]>([]);

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
        const res = await fetch(
          `/api/slots?practitionerId=${selectedDoctorId}&start=${startDate}&end=${endDate}`
        );
        if (!res.ok) throw new Error("Erreur lors du chargement des créneaux");

        const data: WeekScheduleInfosType = await res.json();
        console.log(data);
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
              disabled={currentStart.getDate() === new Date().getDate()}
              onClick={() =>
                setCurrentStart((d) => {
                  const next = new Date(d);
                  next.setDate(next.getDate() - 7);
                  return next;
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
                  next.setDate(next.getDate() + 7);
                  return next;
                })
              }
            >
              ➡️
            </button>
          </div>
          <ul className={styles["days-list"]}>
            {availabilities.map((a) => (
              <li key={a.date} className={styles["day-item"]}>
                <strong className={styles["day-label"]}>
                  {new Date(a.date).toLocaleDateString("fr-FR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                </strong>
                <div className={styles.slots}>
                  {a.slots.length ? (
                    a.slots.map((slot) => (
                      <button key={slot} className={styles["slot-btn"]}>
                        {slot}
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
