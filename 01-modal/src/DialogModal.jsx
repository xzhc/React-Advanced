import { useEffect } from "react";
import { useRef } from "react";
import { createPortal } from "react-dom";

export function DialogModal({ children, isOpen, onClose }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog == null) {
      return;
    }
    if (isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog == null) {
      return;
    }
    dialog.addEventListener("close", onClose);

    return () => {
      dialog.removeEventListener("close", onClose);
    };
  }, [onClose]);
  return createPortal(
    <dialog ref={dialogRef}>{children}</dialog>,
    document.getElementById("modal-container")
  );
}
