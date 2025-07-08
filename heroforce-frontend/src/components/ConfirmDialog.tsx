import React from "react";
import styles from "../styles/components/ConfirmDialog.module.css";

interface ConfirmDialogProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog = ({ message, onConfirm, onCancel }: ConfirmDialogProps) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.dialog}>
        <p>{message}</p>
        <div className={styles.actions}>
          <button onClick={onConfirm} className={styles.confirm}>
            Confirmar
          </button>
          <button onClick={onCancel} className={styles.cancel}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;