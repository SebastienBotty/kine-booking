import React, { useState } from "react";
import styles from "@/styles/components/AppointmentSummary.module.scss";
import { Doctor } from "@/types/type";
import { DateTimeFormatOptions, useTranslations } from "next-intl";
import { Button } from "./Button";
import { FaUserClock, FaRegCalendarCheck, FaRegCalendarXmark, FaCalendar } from "react-icons/fa6";
import { postAppointment } from "@/api/appointmentApi";
import { useErrorMessages } from "@/hooks/useErrorMsg";
import { ApiError } from "@/lib/errors";

interface props {
  doctor: Doctor;
  patientId: string;
  startTime: Date;
  endTime: Date;
  creatorId: string;
  formatDate: (date: Date, options?: DateTimeFormatOptions) => string;
  toggleSlotAvailability?: (slotId: string, block: boolean) => void;
  closeModal?: () => void;
}

function AppointmentSummary(props: props) {
  const t = useTranslations();
  const [patientNote, setPatientNote] = useState("");
  const { getErrorMessage } = useErrorMessages();
  const [errorMsg, setErrorMsg] = useState("");
  const [confirmationMsg, setConfirmationMsg] = useState(false);

  const formattedDate = props.formatDate(new Date(props.startTime), {
    year: "numeric",
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const formattedHour = `${props.formatDate(new Date(props.startTime), {
    hour: "2-digit",
    minute: "2-digit",
  })} - ${props.formatDate(new Date(props.endTime), {
    hour: "2-digit",
    minute: "2-digit",
  })}`;

  const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  const confirmAppointment = async () => {
    postAppointment({
      practitionerId: props.doctor.id,
      patientId: props.patientId,
      creatorId: props.creatorId,
      startTime: props.startTime,
      endTime: props.endTime,
      patientNote: patientNote,
    })
      .then((appointmentBooked) => {
        if (props.toggleSlotAvailability) {
          console.log("OK IC");
          props.toggleSlotAvailability(appointmentBooked.startTime, true);
        }
        setConfirmationMsg(true);
        setTimeout(() => {
          props.closeModal && props.closeModal();
        }, 5000);
      })
      .catch((err) => {
        const errorMessage = getErrorMessage(err as ApiError | Error);
        console.error("Erreur lors de la confirmation:", err);
        setErrorMsg(errorMessage);

        if (err.code === "SLOT_ALREADY_TAKEN" && props.toggleSlotAvailability) {
          props.toggleSlotAvailability(props.startTime.toDateString(), true);
          setTimeout(() => {
            props.closeModal && props.closeModal();
          }, 5000);
        }
      });
  };
  return (
    <div className={styles["appointment-summary"]}>
      {errorMsg && !confirmationMsg && (
        <div className={`${styles["response-message"]} error-bg`}>
          <FaRegCalendarXmark color="#a83232" size={"5rem"} />
          <div>
            {" "}
            <div className={`${styles["confirmation-text-title"]} error-text`}>{t("fail")}</div>
            <div className={`${styles["confirmation-text-details"]} error-text`}>{errorMsg}</div>
          </div>
        </div>
      )}
      {confirmationMsg && !errorMsg && (
        <div className={` ${styles["response-message"]} confirmation-bg`}>
          <FaRegCalendarCheck color="#237a57" size={"5rem"} />
          <div>
            {" "}
            <div className={`${styles["confirmation-text-title"]} confirmation-text`}>
              {t("AppointmentSummary.booking.confirmed")}
            </div>
            <div className={`${styles["confirmation-text-details"]} confirmation-text`}>
              {t("AppointmentSummary.booking.confirmedDetails")}
            </div>
          </div>
        </div>
      )}
      {!errorMsg && !confirmationMsg && (
        <>
          <div className={styles["appointment-note"]}>
            <textarea
              name="patient-note"
              id="patient-note"
              className={styles["textarea-note"]}
              placeholder={t("AppointmentSummary.textAreaNote")}
              maxLength={150}
              value={patientNote}
              onChange={(e) => setPatientNote(e.target.value)}
            />
            <div className={styles["appointment-buttons"]}>
              <Button
                variant="primary"
                size="md"
                iconLeft={<FaCalendar />}
                onClick={confirmAppointment}
              >
                Confirmer
              </Button>
            </div>
          </div>
          <div className={styles["appointment-ticket"]}>
            {" "}
            <div className={styles["appointment-image-container"]}>
              <img
                src={props.doctor.image}
                alt={`Photo de ${props.doctor.name}`}
                className={styles["appointment-image"]}
              />
            </div>
            <div className={styles["summary-card"]}>
              <div className={styles["appointment-doctor-name"]}>Dr. {props.doctor.name}</div>
              <div className={styles["appointment-time"]}>
                <span> {capitalizedDate}</span>
                <br />
                <span>{formattedHour}</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default AppointmentSummary;
