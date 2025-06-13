"use client";
import React, { useEffect, useState } from "react";
import styles from "./appointments.module.scss";
import { isValid, parseISO, startOfWeek } from "date-fns";
import { useSlots } from "@/hooks/useSlots";
import { fetchAllPractitioners } from "@/api/practitionerApi";
import { Doctor } from "@/types/type";
import { useTranslations, useFormatter } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";

export default function AppointmentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const t = useTranslations();
  const format = useFormatter();

  const [doctors, setDoctors] = useState<Doctor[]>([]);

  const doctorIdFromURL = searchParams.get("practitioner") || "";
  const dateFromURL = searchParams.get("startDate");
  const parsedDate =
    dateFromURL && isValid(parseISO(dateFromURL))
      ? startOfWeek(new Date(dateFromURL), { weekStartsOn: 1 })
      : startOfWeek(new Date(), { weekStartsOn: 1 });

  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(doctorIdFromURL);
  const [currentStart, setCurrentStart] = useState<Date>(parsedDate);
  const { availabilities, loading, error } = useSlots(selectedDoctorId, currentStart);

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const doctors = await fetchAllPractitioners();
        setDoctors(doctors);
      } catch (error) {
        console.error(error);
      }
    };

    loadDoctors();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();

    if (selectedDoctorId) params.set("practitioner", selectedDoctorId);
    if (currentStart) params.set("startDate", currentStart.toISOString().split("T")[0]);

    router.replace(`/en/appointments?${params.toString()}`);
  }, [selectedDoctorId, currentStart]);

  return (
    <div className={styles["appointment-container"]}>
      <h2 className={styles.title}>{t("appointments.booking")}</h2>
      <label htmlFor="doctor-select">{t("appointments.choosePractitioner")}</label>
      <select
        id="doctor-select"
        className={styles["doctor-select"]}
        value={selectedDoctorId}
        onChange={(e) => {
          setSelectedDoctorId(e.target.value);
          console.log(e.target.value);
        }}
      >
        <option value="">--{t("appointments.select")}--</option>
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
                  const prev = new Date(d);
                  prev.setDate(prev.getDate() - 7);
                  return prev;
                })
              }
            >
              ➡️
            </button>
            <span>
              {t("appointments.currentWeek")} {format.dateTime(currentStart)}
            </span>
            <button
              aria-label="7 jours suivants"
              className={styles["arrow-btn"]}
              onClick={() =>
                setCurrentStart((d) => {
                  const next = new Date(d);
                  next.setDate(currentStart.getDate() + 7);
                  return next;
                })
              }
            >
              ➡️
            </button>
          </div>
          <ul className={styles["days-list"]}>
            {availabilities.map((daySlots, index) => {
              if (index === 0) return null;
              else {
                return (
                  <li key={index} className={styles["day-item"]}>
                    <strong className={styles["day-label"]}>
                      {daySlots.length > 0
                        ? format.dateTime(new Date(daySlots[0].startTime), {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                          })
                        : format.dateTime(
                            new Date(
                              new Date().setDate(
                                new Date().getDate() + ((index - new Date().getDay() + 7) % 7)
                              )
                            ),
                            {
                              weekday: "long",
                              day: "numeric",
                              month: "long",
                            }
                          )}
                    </strong>
                    <div className={styles.slots} onClick={() => console.log(daySlots)}>
                      {!daySlots.every((d) => d.blocked == true) ? (
                        daySlots.map((slot) => (
                          <button
                            key={slot.id}
                            className={`${styles["slot-btn"]} ${
                              slot.blocked ? styles["blocked"] : ""
                            }`}
                            onClick={() => console.log(slot)}
                          >
                            {new Date(slot.startTime).toLocaleTimeString("fr-FR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </button>
                        ))
                      ) : (
                        <span className={styles["no-slot"]}>
                          {t("appointments.no-availability")}
                        </span>
                      )}
                    </div>
                  </li>
                );
              }
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
