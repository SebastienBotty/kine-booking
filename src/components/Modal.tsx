import React from "react";
import styles from "@/styles/components/Modal.module.scss";

function Modal({
  isOpen,
  close,
  children,
}: {
  isOpen: boolean;
  close: () => void;
  children: React.ReactNode;
}) {
  if (!isOpen) return null;
  return (
    <div className={styles["modal-overlay"]} onClick={() => close()}>
      <div className={styles["modal-content"]} onClick={(e) => e.stopPropagation()}>
        {" "}
        {children}
      </div>
    </div>
  );
}

export default Modal;
