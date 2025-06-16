"use client";
import React, { useEffect, useState, useMemo } from "react";
import styles from "./appointments.module.scss";
import { isValid, parseISO, startOfWeek } from "date-fns";
import { useSlots } from "@/hooks/useSlots";
import { fetchAllPractitioners } from "@/api/practitionerApi";
import { AvailabilityType, Doctor, SlotsType } from "@/types/type";
import { useTranslations, useFormatter, useLocale } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import Modal from "@/components/Modal";
import { useSession } from "next-auth/react";
import AppointmentSummary from "@/components/AppointmentSummary";
import { SignInButton } from "@/components/AuthButtons";
import { getMondayAt5AM } from "@/lib/functions/helpers";

export default function AppointmentPage() {
  const { data: session } = useSession();

  const searchParams = useSearchParams();
  const router = useRouter();
  const [showConfirmationModal, setShowConfirmationModal] = useState<boolean>(false);

  const t = useTranslations();
  const format = useFormatter();
  const locale = useLocale();

  const doctorIdFromURL = searchParams.get("practitioner") || "";
  const dateFromURL = searchParams.get("startDate") || "";

  // Toujours s'assurer que parsedDate est un début de semaine
  const parsedDate = useMemo(() => {
    if (dateFromURL && isValid(parseISO(dateFromURL))) {
      return getMondayAt5AM(parseISO(dateFromURL));
    }
    return getMondayAt5AM();
  }, [dateFromURL]);

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<AvailabilityType | null>(null);
  const [currentStart, setCurrentStart] = useState<Date>(parsedDate);
  const [initialized, setInitialized] = useState(false);

  const { availabilities, setAvailabilities, loading, error } = useSlots(
    selectedDoctorId,
    currentStart
  );

  const handleSlotClick = (slot: AvailabilityType) => {
    setSelectedSlot(slot);
    setShowConfirmationModal(true);
  };

  const toggleSlotAvailability = (slotId: string, block: boolean) => {
    const slotDate = new Date(slotId);
    const day = slotDate.getDay();
    setAvailabilities((prev) => {
      const newAvailabilities = [...prev];
      const dayArr = newAvailabilities[day];
      const target = dayArr.find(
        (slot) => new Date(Number(slot.id)).getTime() === new Date(slotId).getTime()
      );

      if (!target) return prev;
      target.blocked = block;
      return newAvailabilities;
    });
  };

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

  // Initialisation unique à partir des paramètres d'URL
  useEffect(() => {
    if (!initialized) {
      setSelectedDoctorId(doctorIdFromURL);
      setCurrentStart(parsedDate);
      setInitialized(true);
    }
  }, [doctorIdFromURL, parsedDate, initialized]);

  // Mise à jour de l'URL seulement après initialisation
  useEffect(() => {
    if (!initialized) return;

    const params = new URLSearchParams();
    if (selectedDoctorId) params.set("practitioner", selectedDoctorId);
    if (currentStart) {
      // Stocker la date telle quelle (currentStart est déjà un startOfWeek)
      params.set("startDate", currentStart.toISOString().split("T")[0]);
    }

    router.replace(`/${locale}/appointments?${params.toString()}`);
  }, [selectedDoctorId, currentStart, initialized, router]);

  return (
    <div className={styles["appointment-container"]}>
      {showConfirmationModal && selectedSlot && (
        <Modal isOpen={showConfirmationModal} close={() => setShowConfirmationModal(false)}>
          {session?.user ? (
            <AppointmentSummary
              patientId={session.user.id}
              creatorId={session.user.id}
              doctor={doctors.find((d) => d.id === selectedDoctorId)!}
              startTime={new Date(selectedSlot.startTime)}
              endTime={new Date(selectedSlot.endTime)}
              formatDate={format.dateTime}
              toggleSlotAvailability={toggleSlotAvailability}
              closeModal={() => setShowConfirmationModal(false)}
            />
          ) : (
            <SignInButton />
          )}
        </Modal>
      )}

      <h2 className={styles.title}>{t("appointments.booking")}</h2>
      <label htmlFor="doctor-select">{t("appointments.choosePractitioner")}</label>
      <select
        id="doctor-select"
        className={styles["doctor-select"]}
        value={selectedDoctorId}
        onChange={(e) => {
          setSelectedDoctorId(e.target.value);
          console.log(doctors);
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
            <button
              aria-label="7 jours précédents"
              className={styles["arrow-btn"]}
              disabled={currentStart.getTime() < new Date().getTime()}
              onClick={() =>
                setCurrentStart((d) => {
                  const prev = new Date(d);
                  prev.setDate(prev.getDate() - 7);
                  return getMondayAt5AM(prev);
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
                  next.setDate(d.getDate() + 7);
                  return getMondayAt5AM(next);
                })
              }
            >
              ➡️
            </button>
          </div>
          <ul className={styles["days-list"]}>
            {availabilities.map((daySlots, index) => {
              if (index === 0) return null;
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
                          onClick={() => handleSlotClick(slot)}
                        >
                          {new Date(slot.startTime).toLocaleTimeString("fr-FR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </button>
                      ))
                    ) : (
                      <div className={styles["no-slot"]}>{t("appointments.no-availability")}</div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
