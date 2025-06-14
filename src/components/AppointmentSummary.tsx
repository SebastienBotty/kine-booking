import React from "react";
import styles from "@/styles/components/AppointmentSummar.module.scss";
import { Doctor } from "@/types/type";

interface props {
  doctor: Doctor;
  patientId: string;
  startTime: Date;
  endTime: Date;
  creatorId: string;
}

function AppointmentSummary(props: props) {
  return <div className={styles["appointment-summary"]}></div>;
}

export default AppointmentSummary;
